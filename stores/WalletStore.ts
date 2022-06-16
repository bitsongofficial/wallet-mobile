import {autorun, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmosWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletData } from "core/types/storing/Generic";
import { CoinClasses, SupportedCoins } from "constants/Coins";
import RemoteConfigsStore from "./RemoteConfigsStore";
import { PermissionsAndroid } from "react-native";
import { ExportKeyRingData, QRCodeSharedData, WCExportKeyRingDatasResponse } from "core/types/storing/Keplr";
import WalletConnect from "@walletconnect/client";
import { Counter, ModeOfOperation } from "aes-js"

export interface StoreWallet {
  data: WalletData,
  wallets: {
    [K in SupportedCoins]: Wallet
  },
}

export default class WalletStore {
  walletsHanlder: IReactionDisposer
  firstLoadHandler: IReactionDisposer
  activeWallet: StoreWallet | null = null

  wallets: StoreWallet[] = []
  loading = false
  firstLoad = false

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
    this.walletsHanlder = reaction(
      () => JSON.stringify(this.wallets.map(w => toJS(w.data))),
      async (json) =>
      {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
        {
          AsyncStorage.setItem('walletNames', json)
        }
      }
    )
  }

  private addSupportedWallets(walletData: WalletData, mnemonic?: string)
  {
    let wallets:any = {}
    for(const chain of this.remoteConfigs.enabledCoins)
    {
      const [wallet, store] = CosmosWalletGenerator.CosmosWalletFromChain(
      {
        chain: CoinClasses[<SupportedCoins>chain].coin.chain(),
        metadata: walletData.metadata,
        name: walletData.name,
      })
      wallets[chain] = wallet
      if(mnemonic) store.Set(mnemonic)
    }
    return wallets
  }

  async loadWallets()
  {
    runInAction(() =>
    {
      this.loading = true
    })
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    )
    if(granted === PermissionsAndroid.RESULTS.GRANTED)
    {
      const walletsMetaDataSerialized = await AsyncStorage.getItem('walletNames')
      if(walletsMetaDataSerialized != null)
      {
        const walletsMetaData = JSON.parse(walletsMetaDataSerialized) as Array<WalletData>
        if(walletsMetaData != null)
        {
          runInAction(() =>
          {
            this.wallets = walletsMetaData.map(walletData => {
              return {
                data: walletData,
                wallets: this.addSupportedWallets(walletData),
              }
            })
            if(this.wallets.length > 0) this.activeWallet = this.wallets[0]
            this.loading = false
          })
        }
      }
    }
    else
    {
      runInAction(() =>
      {
        this.loading = false
      })
    }
    runInAction(() =>
    {
      this.firstLoad = true
    })
  }

  async importFromKeplr(name: string, keplrQRData: string)
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
            console.log(keyRingData)
            // We are considering just mnemonic wallets for now because we need to focus on other tasks
            // but adding them should be straightforward
            if(keyRingData.type == "mnemonic")
            {
              const mnemonic = keyRingData.key
              walletsLoading.push(this.newCosmosWallet(keyRingData.meta.name, mnemonic.split(" ")))
            }
          })
        return await Promise.all(walletsLoading)
    }
    catch(e)
    {
      console.log(e)
    }    
  }

  async newCosmosWallet(name: string, mnemonic: string[])
  {
    if(!this.wallets.some(el => (el.data.name == name)))
    {
      const mnemonicString = mnemonic.join(" ")
      const wallets:any = {}
      const storeWaitings = []
      for(const chain of this.remoteConfigs.enabledCoins)
      {
        const [wallet, store] = CosmosWalletGenerator.CosmosWalletFromChain({name, chain})
        storeWaitings.push(store.Set(mnemonicString))
        wallets[chain] = wallet
      }
      await Promise.all(storeWaitings)
      const addresses:any = {}
      const chainAddressPairWaitings:any = []
      for(const chain of this.remoteConfigs.enabledCoins)
      {
        chainAddressPairWaitings.push(new Promise(async (resolve, reject) =>
        {
          resolve([chain, await wallets[chain].Address()])
        }))
      }
      const chainAddressPairs = await Promise.all(chainAddressPairWaitings)
      chainAddressPairs.forEach(cap =>
      {
        addresses[cap[0]] = cap[1]
      })
      let data = {
        name,
        metadata: {
          addresses
        }
      }
      return new Promise<void>((resolve, reject) =>
      {
        runInAction(() =>
        {
          const newWallet = {
            data,
            wallets: this.addSupportedWallets(data, mnemonic.join(" ")),
          }
          this.wallets.push(newWallet)
          if(this.wallets.length == 1) this.activeWallet = newWallet
          resolve()
        })
      })
    }
  }

  changeActive(wallet: number | StoreWallet | null)
  {
    if(wallet == null) return
    if(typeof wallet == "number") wallet = this.wallets[wallet]
    this.activeWallet = wallet
  }

  deleteWallet(wallet: StoreWallet)
  {
    this.wallets.splice(
      this.wallets.findIndex((item) => item === wallet),
      1
    )
  }
}
