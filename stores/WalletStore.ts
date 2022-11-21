import {autorun, IReactionDisposer, makeAutoObservable, reaction, runInAction, set, toJS } from "mobx";
import { CosmosWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletTypes } from "core/types/storing/Generic";
import RemoteConfigsStore from "./RemoteConfigsStore";
import { ExportKeyRingData, QRCodeSharedData, WCExportKeyRingDatasResponse } from "core/types/storing/Keplr";
import WalletConnect from "@walletconnect/client";
import { Counter, ModeOfOperation } from "aes-js"
import { AskPinMnemonicStore } from "core/storing/MnemonicStore";
import { SupportedCoins, SupportedCoinsMap } from "constants/Coins";
import { getPrefixFromAddress } from "core/utils/Address";
import { PublicWallet } from "core/storing/Generic";
import SettingsStore from "./SettingsStore";
import LocalStorageManager from "./LocalStorageManager";
import { askPin } from "navigation/AskPin";
import uuid from 'react-native-uuid';
import { navigate } from "navigation/utils";
import { isPinSaved } from "utils/biometrics";
import { fromPrefixToCoin } from "core/utils/Coin";
import { globalLoading } from "modals";

export const cosmos_mnemonic_prefix = "mnemonic_"

export interface Profile {
  name: string,
  type: WalletTypes,
  data: any,
  avatar?: string,
}

export interface ProfileInner extends Profile {
  id: string,
}

type profileIndexer = number | string | ProfileInner | Profile | ProfileWallets

export interface ProfileWallets {
  profile: ProfileInner,
  wallets: SupportedCoinsMap<Wallet>
}

export default class WalletStore {
	localStorageManager?: LocalStorageManager

  private walletSetUpPin: string | undefined

  activeProfile: ProfileInner | null = null

  profiles: ProfileInner[] = []
  wallets: ProfileWallets[] = []
  loading = false
  firstLoad = false
  loadedFromMemory = false
  pinAsked = false

  private setUpWalletsHandler?: IReactionDisposer

  constructor(private settings: SettingsStore, private remoteConfigs: RemoteConfigsStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.setUpWalletsHandler = reaction(
      () => (
        {
          profiles: this.profiles.map(p => (
            {
              type: p.type,
              data: p.data,
            })),
          loaded: this.remoteConfigs.firstLoad && this.loadedFromMemory,
        }),
      () =>
      {
        this.setUpWallets()
      })
    // autorun(() => this.setUpWallets())
  }

  setLoadedFromMemory(loaded: boolean)
  {
    this.loadedFromMemory = loaded
  }

  async importFromKeplr(name: string, keplrQRData: string, pin?: string)
  {
    const sharedData = JSON.parse(keplrQRData) as QRCodeSharedData;
    if (!sharedData.wcURI || !sharedData.sharedPassword) {
      throw new Error("Invalid qr code");
    }
    try
    {
      const connector = new WalletConnect(
        {
          // Required
          uri: sharedData.wcURI,
          // Required
          clientMeta: {
            description: "WalletConnect Developer App",
            url: "https://walletconnect.org",
            icons: ["https://walletconnect.org/walletconnect-logo.png"],
            name: "WalletConnect",
          },
        })

        if (connector.connected) {
          await connector.killSession();
        }

        await new Promise<void>((resolve, reject) => {
          connector.on("session_request", (error) => {
            if (error) {
              reject(error)
            } else {
              connector.approveSession({ accounts: [], chainId: 77777 })

              resolve()
            }
          })
        })
        const result = (
          await connector.sendCustomRequest({
            id: Math.floor(Math.random() * 100000),
            method: "keplr_request_export_keyring_datas_wallet_connect_v1",
            params: [
              // {
              //   addressBookChainIds: ['bigbang-test-4'],
              // },
            ],
          })
        )[0] as WCExportKeyRingDatasResponse
        
        const counter = new Counter(0)
        counter.setBytes(Buffer.from(result.encrypted.iv, "hex"));
        const aesCtr = new ModeOfOperation.ctr(
          Buffer.from(sharedData.sharedPassword, "hex"),
          counter
        )

        const decrypted = aesCtr.decrypt(
          Buffer.from(result.encrypted.ciphertext, "hex")
        )

        const exportedKeyRingDatas = JSON.parse(
          Buffer.from(decrypted).toString()
        ) as ExportKeyRingData[]

        const walletsLoading: Promise<void>[] = []
        const actualPin = pin ?? await askPin()
        exportedKeyRingDatas.forEach(keyRingData =>
          {
            // We are considering just mnemonic wallets for now because we need to focus on other tasks
            // but adding them should be straightforward
            if(keyRingData.type == "mnemonic")
            {
              const mnemonic = keyRingData.key
              walletsLoading.push(this.newCosmosWallet(keyRingData.meta.name, mnemonic.split(" "), actualPin))
            }
          })
        return await Promise.all(walletsLoading)
    }
    catch(e)
    {
      console.error("Catched", e)
    }
    return true
  }

  profileExists(name: string)
  {
    return this.profiles.some(el => (el.name == name))
  }

  async newCosmosWallet(name: string, mnemonic: string[], pin?:string)
  {
    if(!this.profileExists(name))
    {
      const mnemonicString = mnemonic.join(" ")
      const id = uuid.v4().toString()
      const mnemonicPath = cosmos_mnemonic_prefix + id
      const mnemonicStore = new AskPinMnemonicStore(mnemonicPath, askPin)
      const actualPin = pin ?? await askPin()
      mnemonicStore.Unlock(actualPin)
      await mnemonicStore.Set(mnemonicString)
      mnemonicStore.Lock()
      runInAction(() =>
      {
        this.walletSetUpPin = actualPin
        this.addProfile({
          name,
          type: WalletTypes.COSMOS,
          id,
          data: {
            mnemonicPath
          }
        })
      })
    }
  }

  async newWatchWallet(name: string, address: string)
  {
    if(!this.profileExists(name))
    {
      runInAction(() =>
      {
        this.addProfile({
          name,
          type: WalletTypes.WATCH,
          id: uuid.v4().toString(),
          data: {
            address: address.trim(),
          }
        })
      })
    }
  }

  private resolveProfile(profile: profileIndexer): ProfileInner | null
  {
    const inputProfile = profile as any
    if(inputProfile.id) return this.profiles.find(p => p.id == inputProfile.id) ?? null
    if(typeof profile == "number") return this.profiles[profile]
    if(typeof profile == "string") return this.profiles.find(p => p.id == profile) ?? null
    let targetProfile = inputProfile
    if(inputProfile.profile) targetProfile = inputProfile.profile
    return this.profiles.find(p => p.name == targetProfile.name) ?? null
  }

  name(profile: profileIndexer)
  {
    return this.resolveProfile(profile)?.name ?? ""
  }

  async address(profile: profileIndexer, chain: SupportedCoins)
  {
    return await this.wallet(profile)?.wallets[chain]?.Address()
  }

  changeActive(profile: profileIndexer | null)
  {
    if(profile == null) return
    this.activeProfile = this.resolveProfile(profile)
  }

  private addProfile(profile: ProfileInner)
  {
    this.profiles.push(profile)
    if(this.profiles.length == 1) this.changeActive(0)
  }

  async setSetUpsPin(pin: string)
  {
    if(this.localStorageManager && await this.localStorageManager.verifyPin(pin)) this.walletSetUpPin = pin
  }

  async setUpWallets()
  {
    if(!this.loadedFromMemory) return
    if(!this.remoteConfigs.firstLoad) return
    runInAction(() =>
    {
      this.pinAsked = false
    })
    runInAction(() =>
    {
      this.loading = true
    })
    if(this.profiles.length > 0)
    {
      const wallets: ProfileWallets[] = []
      const pin = this.walletSetUpPin ?? await askPin()
      this.walletSetUpPin = undefined
      runInAction(() =>
      {
        this.pinAsked = true
      })
      globalLoading.open()
      await Promise.all(toJS(this.profiles).map(async (profile, index) =>
      {
        switch(profile.type)
        {
          case WalletTypes.COSMOS:
            const cosmosWallets: SupportedCoinsMap = {}
            const store = new AskPinMnemonicStore(profile.data.mnemonicPath, askPin)
            store.Unlock(pin)
            const addressesWaitings: Promise<string>[] = []
            for(const chain of this.remoteConfigs.enabledCoins)
            {
              const wallet = CosmosWalletGenerator.CosmosWalletFromChain({
                chain,
                store,
              })
              cosmosWallets[chain] = wallet
              addressesWaitings.push(wallet.Address())
            }
            try
            {
              await Promise.all(addressesWaitings)
              wallets.push({
                profile: this.profiles[index],
                wallets: cosmosWallets
              })
            }
            catch(e)
            {
              console.error("Catched", e)
              this.deleteProfile(profile)
            }
            store.Lock()
            break
          case WalletTypes.WATCH:
            try
            {
              const prefix = getPrefixFromAddress(profile.data.address)
              if(prefix)
              {
                const coin = fromPrefixToCoin(prefix)
                if(coin)
                {
                  const pubWallets: SupportedCoinsMap = {}
                  pubWallets[coin] = new PublicWallet(profile.data.address)
                  wallets.push({
                    profile: this.profiles[index],
                    wallets: pubWallets
                  })
                }
              }
            }
            catch (e)
            {
              this.deleteProfile(profile)
            }
            break
        }
      }))
      runInAction(() =>
      {
        this.wallets.splice(0, this.wallets.length, ...wallets)
      })
    }
    runInAction(() =>
    {
      this.firstLoad = true
      this.loading = false
    })
    globalLoading.close()
  }

  private wallet(profile: profileIndexer)
  {
    const actualProfile = this.resolveProfile(profile)
    return this.wallets.find(w => w.profile.id == actualProfile?.id) ?? null
  }

  get activeWallet()
  {
    return this.activeProfile ? this.wallet(this.activeProfile) : null
  }

  chainWallet(profile: profileIndexer, chain: SupportedCoins)
  {
    return this.wallet(profile)?.wallets[chain]
  }

  changeProfileName(profile: profileIndexer, name: string)
  {
    const p = this.resolveProfile(profile)
    if(p) set(p, {
      name,
    })
  }

  changeActiveProfileName(name: string)
  {
    if(this.activeProfile == null) return
    this.changeProfileName(this.activeProfile, name)
  }

  changeProfileAvatar(profile: profileIndexer, uri: string)
  {
    const p = this.resolveProfile(profile)
    if(p) set(p, {
      avatar: uri
    })
  }

  changeActiveProfileAvatar(uri: string)
  {
    if(this.activeProfile == null) return
    this.changeProfileAvatar(this.activeProfile, uri)
  }

  deleteProfile(profile: profileIndexer)
  {
    const p = this.resolveProfile(profile)
    if(p == undefined) return
    this.localStorageManager?.removeProfileData(p)
    this.profiles.splice(this.profiles.indexOf(p), 1)
    if(this.profiles.length < 1)
    {
      this.activeProfile = null
      if(this.settings.biometric_enable) this.settings.setBiometric(false) 
      navigate("Start")
      return
    }
    if(p == this.activeProfile) this.activeProfile = this.profiles[0]
  }
}