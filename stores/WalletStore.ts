import { Coin } from "classes";
import Mock from "./mock";
import {IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmoWalletGenerator } from "core/storing/Wallet";
import { Wallet, WalletData } from "core/types/storing/Generic";
import { CoinClasses, SupportedCoins } from "constants/Coins";

const rates = {
  juno: 13.35,
  bitsong: 0.06,
  osmosis: 4.39,
};

export interface StoreWallet {
  data: WalletData,
  wallets: {
    [K in SupportedCoins]: Wallet
  },
}
export default class WalletStore {
  walletsHanlder: IReactionDisposer | null = null
  activeWallet: StoreWallet | null = null

  coins = [
    new Coin(Mock.BitSong, rates.bitsong),
    new Coin(Mock.Juno, rates.juno),
    new Coin(Mock.Osmosis, rates.osmosis),
  ];

  wallets: StoreWallet[] = []

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.loadWallets()
    this.walletsHanlder = reaction(
      () => JSON.stringify(this.wallets.map(w => toJS(w.data))),
      json => AsyncStorage.setItem('walletNames', json)
    )
  }

  private addSupportedWallets(walletData: WalletData, mnemonic?: string)
  {
    let wallets:any = {}
    for(const chain of Object.values(SupportedCoins))
    {
      const [wallet, store] = CosmoWalletGenerator.CosmoWalletFromChain(
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
    })
  }

  async newCosmoWallet(name: string, mnemonic: string[])
  {
    if(!this.wallets.find(el => (el.data.name == name)))
    {
      const mnemonicString = mnemonic.join(" ")
      const wallets:any = {}
      const storeWaitings = []
      for(const chain of Object.values(SupportedCoins))
      {
        const [wallet, store] = CosmoWalletGenerator.CosmoWalletFromChain({name, chain})
        storeWaitings.push(store.Set(mnemonicString))
        wallets[chain] = wallet
      }
      await Promise.all(storeWaitings)
      const addresses:any = {}
      const chainAddressPairWaitings:any = []
      for(const chain of Object.values(SupportedCoins))
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
      runInAction(() => this.wallets.push({
        data,
        wallets: this.addSupportedWallets(data, mnemonic.join(" ")),
      }))
    }
  }
}
