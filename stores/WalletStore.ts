import {autorun, flow, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmosWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletTypes } from "core/types/storing/Generic";
import RemoteConfigsStore from "./RemoteConfigsStore";
import { PermissionsAndroid } from "react-native";
import { ExportKeyRingData, QRCodeSharedData, WCExportKeyRingDatasResponse } from "core/types/storing/Keplr";
import WalletConnect from "@walletconnect/client";
import { Counter, ModeOfOperation } from "aes-js"
import { SerializableI } from "core/types/utils/serializable";
import { AESSaltStore } from "core/storing/CipherStores";
import { AskPinMnemonicStore } from "core/storing/MnemonicStore";
import { SupportedCoins, SupportedCoinsMap } from "constants/Coins";

const stored_wallets_location = "StoredWallets"
const cosmos_mnemonic_prefix = "mnemonic_"

const askPin = async () => "1234567"

interface StoreWallet extends SerializableI {
  name: string,
  wallet: Wallet,
}

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
  walletsHanlder: IReactionDisposer
  firstLoadHandler: IReactionDisposer
  activeProfile: Profile | null = null

  profiles: Profile[] = []
  wallets: ProfileWallets[] = []
  loading = false
  firstLoad = false
  loadedFromMemory = false

  remoteConfigs

  constructor(remoteConfigs: RemoteConfigsStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.remoteConfigs = remoteConfigs
    this.firstLoadHandler = autorun(() =>
    {
      if(this.remoteConfigs.firstLoad) {
        this.loadWallets()
        this.firstLoadHandler()
      }
    })

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
          AsyncStorage.setItem(stored_wallets_location, json)
        }
      }
    )
  }

  async loadWallets()
  {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    )
    if(granted === PermissionsAndroid.RESULTS.GRANTED)
    {
      const serializedWalletsRaw = await AsyncStorage.getItem(stored_wallets_location)
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
        exportedKeyRingDatas.forEach(keyRingData =>
          {
            // We are considering just mnemonic wallets for now because we need to focus on other tasks
            // but adding them should be straightforward
            if(keyRingData.type == "mnemonic")
            {
              const mnemonic = keyRingData.key
              walletsLoading.push(this.newCosmosWallet(keyRingData.meta.name, mnemonic.split(" "), pin))
            }
          })
        return await Promise.all(walletsLoading)
    }
    catch(e)
    {
      console.log(e)
    }    
  }

  async newCosmosWallet(name: string, mnemonic: string[], pin?:string)
  {
    if(!this.profiles.some(el => (el.name == name)))
    {
      const mnemonicString = mnemonic.join(" ")
      const mnemonicPath = cosmos_mnemonic_prefix + name
      const mnemonicStore = new AskPinMnemonicStore(mnemonicPath, askPin)
      await mnemonicStore.Set(mnemonicString)
      runInAction(() =>
      {
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

  changeActive(profile: number | Profile | null)
  {
    if(profile == null) return
    if(typeof profile == "number") profile = this.profiles[profile]
    this.activeProfile = profile
  }

  deleteProfile(profile: StoreWallet)
  {
    this.profiles.splice(
      this.profiles.findIndex((item) => item.name === profile.name),
      1
    )
  }

  addProfile(profile: Profile)
  {
    this.profiles.push(profile)
  }

  async setUpWallets()
  {
    if(!this.loadedFromMemory) return
    runInAction(() =>
    {
      this.loading = true
    })
    if(this.profiles.length > 0)
    {
      const wallets: ProfileWallets[] = []
      const pin = await askPin()
      toJS(this.profiles).forEach(async profile =>
      {
        switch(profile.type)
        {
          case WalletTypes.COSMOS:
            const cosmosWallets: SupportedCoinsMap = {}
            const store = new AskPinMnemonicStore(profile.data.mnemonicPath, askPin)
            store.Unlock(pin)
            for(const chain of this.remoteConfigs.enabledCoins)
            {
              const wallet = CosmosWalletGenerator.CosmosWalletFromChain({
                chain,
                store,
              })
              cosmosWallets[chain] = wallet
              wallet.Address()
            }
            store.Lock()
            wallets.push({
              profile,
              wallets: cosmosWallets
            })
            break
        }
      })
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