import { IPerson, ITransaction } from "classes/types";
import { SupportedCoins } from "constants/Coins";
import { makeAutoObservable } from "mobx";
import { Asset } from "stores/models/Asset";
import { store } from "stores/Store";
import { InputHandler } from "utils";

export default class TransactionCreater {
  asset: Asset | null = null
  balance: number = 0
  receiver?: IPerson | null = null //
  destinationChainId?: string
  chain?: string

  addressInput = new InputHandler();
  memo = new InputHandler()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getAssetBalanceFromStore() {
    const coinStore = store.coin
    const assetBalance = this.asset ? coinStore.balanceOfAsExponent(this.asset, this.chain) ?? 0 : 0
    return assetBalance
  }

  getAssetFiatValueFromStore() {
    const coinStore = store.coin
    const assetBalance = this.asset ? coinStore.fiatValueOfAsExponent(this.asset, this.chain) ?? 0 : 0
    return assetBalance
  }

  getFiatValue() {
    const coinStore = store.coin
    if(this.chain === undefined || this.asset === null) return 0
    const fiat = coinStore.fromAssetBalanceToFiat({chain: this.chain, denom: this.asset.denom, balance: this.balance})
    if(fiat === undefined) return 0
    return fiat
  }

	setAsset(asset: Asset | null) {
		this.asset = asset
    if(this.destinationChainId === undefined) this.destinationChainId = asset?.chainId
	}

  setChain(chain: string) {
    this.chain = chain
    if(this.destinationChainId === undefined) this.destinationChainId = chain
  }

  setBalance(balance: number) {
    const assetBalance = this.getAssetBalanceFromStore()
    let actualBalance = balance
    if(this.asset && balance > assetBalance) actualBalance = assetBalance
    this.balance = actualBalance
  }
  setReceiver(receiver: IPerson) {
    this.receiver = receiver;
  }

  setMax() {
    const assetBalance = this.getAssetBalanceFromStore()
    if (assetBalance) {
      this.balance = assetBalance;
    }
  }

  setDestinationChainId(destinationChainId: string | undefined)
  {
    this.destinationChainId = destinationChainId
  }

  get address() {
    return this.addressInput.value;
  }

  get isAddressValid() {
    // TODO: upd. this
    return !!this.address;
  }

  get isReady() {
    return !!this.asset && !!this.balance && this.isAddressValid && this.receiver;
  }

  create(): ITransaction | undefined {
    if (!!this.asset && !!this.balance && this.isAddressValid && this.receiver) {
      const { address, balance, asset, receiver } = this;
      return {
        address,
        balance,
        asset: asset,
        receiver,
      };
    }
  }
}
