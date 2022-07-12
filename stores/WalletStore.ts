import {autorun, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmosWalletGenerator, prefixToCoin } from "core/storing/Wallet";
import { WalletTypes } from "core/types/storing/Generic";
import RemoteConfigsStore from "./RemoteConfigsStore";
import { PermissionsAndroid } from "react-native";
import { ExportKeyRingData, QRCodeSharedData, WCExportKeyRingDatasResponse } from "core/types/storing/Keplr";
import WalletConnect from "@walletconnect/client";
import { Counter, ModeOfOperation } from "aes-js"
import { AskPinMnemonicStore } from "core/storing/MnemonicStore";
import { SupportedCoinsMap } from "constants/Coins";
import { getPrefixFromAddress } from "core/utils/Address";
import { PublicWallet } from "core/storing/Generic";
import SettingsStore from "./SettingsStore";
import LocalStorageManager from "./LocalStorageManager";
import { askPin } from "navigation/AskPin";

export const cosmos_mnemonic_prefix = "mnemonic_"

export interface Profile {
  name: string,
  type: WalletTypes,
  data: any,
}

type profileIndexer = number | Profile | ProfileWallets

export interface ProfileWallets {
  profile: Profile,
  wallets: SupportedCoinsMap
}

export default class WalletStore {
	localStorageManager?: LocalStorageManager

  private walletSetUpPin: string | undefined

  activeProfile: Profile | null = null

  profiles: Profile[] = []
  wallets: ProfileWallets[] = []
  loading = false
  firstLoad = false
  loadedFromMemory = false

  constructor(private settings: SettingsStore, private remoteConfigs: RemoteConfigsStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    autorun(() =>
    {
      this.setUpWallets()
    })
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
      console.log(e)
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
      const mnemonicPath = cosmos_mnemonic_prefix + name
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
          data: {
            address
          }
        })
      })
    }
  }

  private resolveProfile(profile: profileIndexer)
  {
    let actualProfile: Profile = profile as Profile
    const inputProfile = profile as any
    if(typeof profile == "number") actualProfile = this.profiles[profile]
    else if(inputProfile.profile) actualProfile = inputProfile.profile
    return actualProfile
  }

  changeActive(profile: profileIndexer | null)
  {
    if(profile == null) return
    this.activeProfile = this.resolveProfile(profile)
  }

  deleteProfile(profile: ProfileWallets | Profile)
  {
    const actualProfile = this.resolveProfile(profile)
    this.profiles.splice(
      this.profiles.findIndex((item) => item.name === actualProfile.name),
      1
    )
  }

  addProfile(profile: Profile)
  {
    this.profiles.push(profile)
    if(this.profiles.length == 1) this.changeActive(0)
  }

  setSetUpsPin(pin: string)
  {
    if(this.localStorageManager && this.localStorageManager.verifyPin(pin)) this.walletSetUpPin = pin
  }

  async setUpWallets()
  {
    if(!this.loadedFromMemory) return
    if(!this.remoteConfigs.firstLoad) return
    runInAction(() =>
    {
      this.loading = true
    })
    if(this.profiles.length > 0)
    {
      const wallets: ProfileWallets[] = []
      const pin = this.walletSetUpPin ?? await askPin()
      this.walletSetUpPin = undefined
      await Promise.all(toJS(this.profiles).map(async profile =>
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
                profile,
                wallets: cosmosWallets
              })
            }
            catch(e)
            {
              runInAction(async () =>
              {
                this.profiles.splice(this.profiles.indexOf(profile), 1)
              })
            }
            store.Lock()
            break
          case WalletTypes.WATCH:
            const prefix = getPrefixFromAddress(profile.data.address)
            const coin = prefixToCoin(prefix)
            if(coin)
            {
              const pubWallets: SupportedCoinsMap = {}
              pubWallets[coin] = new PublicWallet(profile.data.address)
              wallets.push({
                profile,
                wallets: pubWallets
              })
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
  }

  get activeWallet()
  {
    return this.wallets.find(w => w.profile.name == this.activeProfile?.name) ?? null
  }

  changeProfileName(profile: profileIndexer, name: string)
  {
    const p = this.resolveProfile(profile)
    p.name = name
  }

  changeActiveProfileName(name: string)
  {
    if(this.activeProfile == null) return
    this.changeProfileName(this.activeProfile, name)
  }
}