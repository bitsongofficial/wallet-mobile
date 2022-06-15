import {autorun, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmosWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletData } from "core/types/storing/Generic";
import { CoinClasses, SupportedCoins } from "constants/Coins";
import RemoteConfigsStore from "./RemoteConfigsStore";

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
      json => AsyncStorage.setItem('walletNames', json)
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
    const walletsMetaDataSerialized = await AsyncStorage.getItem('walletNames')
    if(walletsMetaDataSerialized == null) return
    const walletsMetaData = JSON.parse(walletsMetaDataSerialized) as Array<WalletData>
    if(walletsMetaData == null) return
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
      runInAction(() =>
      {
        const newWallet = {
          data,
          wallets: this.addSupportedWallets(data, mnemonic.join(" ")),
        }
        this.wallets.push(newWallet)
        if(this.wallets.length == 1) this.activeWallet = newWallet
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
