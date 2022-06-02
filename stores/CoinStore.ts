import { Coin } from "classes";
import { ICoin } from "classes/types";
import { CoinClasses, SupportedCoins } from "constants/Coins";
import { PublicWallet } from "core/storing/Generic";
import { CosmoWallet } from "core/storing/Wallet";
import { FromToAmount } from "core/types/coin/cosmo/FromToAmount";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { WalletData } from "core/types/storing/Generic";
import { autorun, keys, makeAutoObservable, values } from "mobx";
import { round } from "utils";
import mock from "./mock";
import WalletStore, { StoreWallet } from "./WalletStore";


const rates = {
	juno: 13.35,
	btsg: 0.06,
	osmosis: 4.39,
};

export default class CoinStore {
	walletStore
	coins: Coin[] = []
	constructor(walletStore: WalletStore) {
		makeAutoObservable(this, {}, { autoBind: true });
		this.walletStore = walletStore
		autorun(() => {this.updateBalances()})
	}

	async updateBalances()
	{
		const coins:Coin[] = []
		const balanceAwaits = [] 
		const infos:ICoin[] = [] 
		const coinRates:number[] = [] 
		for(const chain of Object.values(SupportedCoins))
		{
			const coin = CoinClasses[chain]
			const info = Object.assign({}, mock[chain])
			try
			{
				const data = values(this.walletStore.activeWallet as StoreWallet)[0] as WalletData
				info.address = data.metadata.addresses[chain]
				balanceAwaits.push(coin.Do(CoinOperationEnum.Balance, {
					wallet: new PublicWallet(this.walletStore.activeWallet?.data.metadata.addresses[chain])
				}))
				infos.push(info)
				coinRates.push(rates[chain])
			}
			catch(e) {
				console.log(e)
			}
		}
		const balances = await Promise.all(balanceAwaits)
		balances.forEach((balance, i) =>
		{
			infos[i].balance = Number(balance.amount)
			coins.push(new Coin(infos[i], coinRates[i]))
		})
		this.coins.splice(0, this.coins.length, ...coins)
		console.log(this.coins)
	}

	get totalBalance()
	{
	  return round(
		this.coins.reduce(
		  (total, coin) => (coin.balanceUSD ? coin.balanceUSD + total : total),
		  0
		)
	  )
	}

	async send(coin: SupportedCoins, address: string, amount:string)
	{
	  if(!(this.walletStore.activeWallet && this.walletStore.activeWallet.wallets[coin])) return
	  const coinClass = CoinClasses[coin]
	  const data: FromToAmount = {
		from: this.walletStore.activeWallet.wallets[coin] as CosmoWallet,
		to: new PublicWallet(address),
		amount: {
		  amount,
		  denom: coinClass.coin.denom()
		}
	  }
	  await coinClass.Do(CoinOperationEnum.Send, data)
	  this.updateBalances()
	}
}