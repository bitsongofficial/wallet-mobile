import { SupportedCoins, SupportedCoinsMap } from "constants/Coins";
import { PublicWallet } from "core/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { CoinClasses } from "core/types/coin/Dictionaries";
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount";
import { Amount, Denom } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { WalletTypes } from "core/types/storing/Generic";
import { autorun, makeAutoObservable, runInAction, toJS, values } from "mobx";
import { round } from "utils";
import WalletStore from "./WalletStore";
import { convertRateFromDenom, fromCoinToAmount, fromCoinToDefaultDenom, resolveAsset } from "core/utils/Coin";
import SettingsStore from "./SettingsStore";
import { isValidAddress } from "core/utils/Address";
import { getSendMessage } from "core/coin/cosmos/operations/Send";
import { globalLoading } from "modals";
import { FromToAmountIbc } from "core/types/coin/cosmos/FromToAmountIbc";
import ChainsStore from "./ChainsStore";
import { AssetBalance, ObservableAssetBalance } from "./models/AssetBalance";
import AssetsStore from "./AssetsStore";
import { Asset } from "./models/Asset";
import { AssetIndex } from "core/types/coin/Assets";
import { Chain, CosmosChain } from "./models/Chain";
import { ChainIndex } from "core/types/coin/Coin";

const maxRecentRecipients = 10

class LoadingState {
	balance: boolean = false
	send: boolean = false
	constructor()
	{
		makeAutoObservable(this)
	}
}

class ResultsState {
	balance: boolean | null = null
	send: boolean | null = null
	constructor()
	{
		makeAutoObservable(this)
	}
}

export default class CoinStore {
	balance: AssetBalance[] = []
	recentRecipients: {
		address: string,
		date: Date,
	}[] = []
	loading = new LoadingState()
	results = new ResultsState()
	constructor(private walletStore: WalletStore, private chainsStore: ChainsStore, private assetsStore: AssetsStore, private settingsStore: SettingsStore) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	findAssetWithCoin(coin: SupportedCoins)
	{
		return this.balance.find(b => b.denom == (CoinClasses[coin].denom()))
	}

	fromFIATToBalance(fiat: number, asset: AssetIndex)
	{
		const assetPrice = this.assetsStore.AssetPrice(asset)
		if(assetPrice) return fiat / assetPrice
	}

	fromAmountToFIAT(amount: Amount)
	{
		const assetPrice = this.assetsStore.AssetPrice(amount.denom)
		const quantity = parseFloat(amount.amount)
		return (assetPrice !== undefined && !Number.isNaN(quantity)) ? assetPrice * quantity : undefined
	}

	fromCoinBalanceToFiat(balance: number, coin: SupportedCoins | string)
	{
		return this.fromAmountToFIAT(fromCoinToAmount(balance, coin))
	}

	fromAssetBalanceToFiat(balance: AssetBalance)
	{
		const assetPrice = this.assetsStore.AssetPrice(balance.denom)
		if(assetPrice) return balance.balance * assetPrice
		return undefined
	}

	balanceAsExponent(balance: AssetBalance, exponent=6)
	{
		const asset = this.assetsStore.ResolveAsset(balance.denom)
		return balance.balance * Math.pow(10, (asset?.exponent ?? exponent) - exponent)
	}

	fiatAsExponent(fiat: number, denom: string, exponent=6)
	{
		const asset = this.assetsStore.ResolveAsset(denom)
		return fiat * Math.pow(10, (asset?.exponent ?? exponent) - exponent)
	}

	balanceOf(asset: Asset, chain?: ChainIndex)
	{
		const chainKey = chain ? this.chainsStore.ChainKey(chain) : undefined
		return this.balance.find(ab => (resolveAsset(ab.denom) == resolveAsset(asset.denom) && (chainKey === undefined || ab.chain == chainKey)))
	}

	balanceOfAsExponent(asset: Asset, chain?: ChainIndex, exponent?: number)
	{
		const balance = this.balanceOf(asset, chain)
		if(balance === undefined) return undefined
		return this.balanceAsExponent(balance, exponent)
	}

	fiatValueOf(asset: Asset, chain?: ChainIndex)
	{
		const assetBalance = this.balanceOf(asset, chain)
		return assetBalance ? this.fromAssetBalanceToFiat(assetBalance) : undefined
	}

	fiatValueOfAsExponent(asset: Asset, chain?: ChainIndex, exponent?: number)
	{
		const fiat = this.fiatValueOf(asset, chain)
		if(fiat === undefined) return undefined
		return this.fiatAsExponent(fiat, asset.denom, exponent)
	}
}