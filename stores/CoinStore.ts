import { Coin } from "classes";
import { ICoin } from "classes/types";
import { CoinClasses, SupportedCoins } from "constants/Coins";
import { PublicWallet } from "core/storing/Generic";
import { CosmoWallet } from "core/storing/Wallet";
import { FromToAmount } from "core/types/coin/cosmo/FromToAmount";
import { Amount, Denom } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { WalletData } from "core/types/storing/Generic";
import { autorun, keys, makeAutoObservable, runInAction, values } from "mobx";
import { round } from "utils";
import mock from "./mock";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore, { StoreWallet } from "./WalletStore";

export default class CoinStore {
	coins: Coin[] = []
	constructor(private walletStore: WalletStore, private remoteConfigs: RemoteConfigsStore) {
		makeAutoObservable(this, {}, { autoBind: true });
		autorun(() => {this.updateBalances()})
	}

	async updateBalances()
	{
		const coins:Coin[] = []
		const balanceAwaits = [] 
		const infos:ICoin[] = [] 
		const coinRates:number[] = [] 
		for(const chain of this.remoteConfigs.enabledCoins)
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
				coinRates.push()
			}
			catch(e) {
				console.log(e)
			}
		}
		const balances = await Promise.all(balanceAwaits)
		balances.forEach((balance:Amount[], i) =>
		{
			balance.forEach(asset => {
				infos[i].balance = this.fromAmountToCoin(asset)
				coins.push(new Coin(infos[i], this.fromDenomToPrice(asset.denom)))
			});
		})
		runInAction(() =>
		{
			console.log(coins)
			this.coins.splice(0, this.coins.length, ...coins)
		})
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

	fromAmountToCoin(amount: Amount)
	{
		let total = 1
		let asset = Number(amount.amount)
		const prices = this.remoteConfigs.prices
		switch(amount.denom)
		{
			default:
				total *= (asset / 1000000)
		}

		return total
	}

	fromDenomToPrice(denom: Denom)
	{
		const prices = this.remoteConfigs.prices

		switch(denom)
		{
			default:
				return prices.bitsong
		}
	}

	fromAmountToDollars(amount: Amount)
	{
		return this.fromAmountToCoin(amount) * this.fromDenomToPrice(amount.denom)
	}
}