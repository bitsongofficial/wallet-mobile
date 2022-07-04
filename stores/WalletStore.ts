import {autorun, flow, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmosWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletTypes } from "core/types/storing/Generic";
import RemoteConfigsStore from "./RemoteConfigsStore";
import { PermissionsAndroid } from "react-native";
import { ExportKeyRingData, QRCodeSharedData, WCExportKeyRingDatasResponse } from "core/types/storing/Keplr";
import WalletConnect from "@walletconnect/client";
import { Counter, ModeOfOperation } from "aes-js"
import { AskPinMnemonicStore } from "core/storing/MnemonicStore";
import { SupportedCoinsMap } from "constants/Coins";
import uuid from 'react-native-uuid';
import { argon2Encode, argon2Verify } from "utils/argon";
import { askPin } from "navigation/AskPin";

const stored_wallets_path = "stored_wallets"
const cosmos_mnemonic_prefix = "mnemonic_"
const pin_hash_path = "pin_hash"

interface Profile {
  name: string,
  type: WalletTypes,
  data: any,
}

export interface ProfileWallets {
  profile: Profile,
  wallets: SupportedCoinsMap
}

export default class WalletStore {
  private walletsHanlder: IReactionDisposer
  private firstLoadHandler: IReactionDisposer
  private walletSetUpPin: string | undefined

  activeProfile: Profile | null = null

  profiles: Profile[] = []
  wallets: ProfileWallets[] = []
  loading = false
  firstLoad = false
  loadedFromMemory = false

  constructor(private remoteConfigs: RemoteConfigsStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    autorun(() =>
    {
      this.setUpWallets()
    })

    this.walletsHanlder = reaction(
      () => JSON.stringify(toJS(this.profiles)),
      async (json) =>
      {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
        {
          AsyncStorage.setItem(stored_wallets_path, json)
        }
      }
    )
  }

  async loadWallets() {
    this.firstLoadHandler = autorun(() =>
    {
      if(this.remoteConfigs.firstLoad) {
        this.loadWalletsInner()
        this.firstLoadHandler()
      }
    })
  }

  async setPin(pin: string): Promise<void> {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED)
    {
      const encodedHash = await argon2Encode(pin)
      await AsyncStorage.setItem(pin_hash_path, encodedHash)
    }
  }

  async verifyPin(pin: string): Promise<boolean> {
    if(pin == "") return false
    try
    {
      const storedHash = await AsyncStorage.getItem(pin_hash_path)
      if(storedHash)
      {
        return await argon2Verify(pin, storedHash)
      }
      else
      {
        this.setPin(pin)
        return true
      }
    }
    catch(e)
    {
    }
    return false
  }

  async loadWalletsInner()
  {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    )
    if(granted === PermissionsAndroid.RESULTS.GRANTED)
    {
      const serializedWalletsRaw = await AsyncStorage.getItem(stored_wallets_path)
      if(serializedWalletsRaw != null)
      {
        const serializedWallets = JSON.parse(serializedWalletsRaw) as Array<Profile>
        if(serializedWallets != null)
        {
          runInAction(() =>
          {
            this.profiles.splice(0, this.profiles.length, ...serializedWallets)
            if(this.profiles.length > 0) this.activeProfile = this.profiles[0]
          })
        }
      }
    }
    runInAction(() =>
    {
      this.loadedFromMemory = true
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

  async newCosmosWallet(name: string, mnemonic: string[], pin?:string)
  {
    if(!this.profiles.some(el => (el.name == name)))
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

  private resolveProfile(profile: number | Profile | ProfileWallets)
  {
    let actualProfile: Profile = profile as Profile
    const inputProfile = profile as any
    if(typeof profile == "number") actualProfile = this.profiles[profile]
    else if(inputProfile.profile) actualProfile = inputProfile.profile
    return actualProfile
  }

  changeActive(profile: number | Profile | ProfileWallets | null)
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
}