import { Coin } from "classes";
import Mock from "./mock";
import { autorun, IObservableArray, IReactionDisposer, makeAutoObservable, reaction, runInAction, toJS, values } from "mobx";
import { round } from "utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CosmoWalletGenerator, mnemonicToAddress, WalletData } from "core/storing/Wallet";
import { Store, Wallet } from "core/types/storing/Generic";

const rates = {
  juno: 13.35,
  bitsong: 0.06,
  osmosis: 4.39,
};

interface StoreWallet {
  data: WalletData,
  wallet: Wallet,
}
export default class WalletStore {
  walletsHanlder:IReactionDisposer | null = null

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

  get totalBalance() {
    return round(
      this.coins.reduce(
        (total, coin) => (coin.balanceUSD ? coin.balanceUSD + total : total),
        0
      )
    );
  }

  async loadWallets () {
    const walletsMetaDataSerialized = await AsyncStorage.getItem('walletNames')
    if(walletsMetaDataSerialized == null) return
    const walletsMetaData = JSON.parse(walletsMetaDataSerialized) as Array<WalletData>
    if(walletsMetaData == null) return
    runInAction(() =>
    {
      this.wallets = walletsMetaData.map(walletData => {
        let wallet
        switch(walletData.chain)
        {
          default:
            wallet = CosmoWalletGenerator.CosmoWalletFromChain(walletData)[0]
        }
  
        return {
          data: walletData,
          wallet,
        }
      })
    })
  }

  async newCosmoWallet (name: string, chain: string, mnemonic: string[]) {
    if(!this.wallets.find(el => (el.data.name == name)))
    {
      const mnemonicString = mnemonic.join(" ")
      const [wallet, store] = CosmoWalletGenerator.CosmoWalletFromChain({name, chain})
      await store.Set(mnemonicString)
      const address = await wallet.Address()
      runInAction(() => this.wallets.push({
        data: {
          name,
          chain,
          metadata: {
            address
          }
        },
        wallet
      }))
    }
  }
}
