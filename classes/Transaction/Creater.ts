import Coin from "classes/Coin";
import { IPerson, ITransaction } from "classes/types";
import { SupportedCoins } from "constants/Coins";
import { makeAutoObservable, toJS } from "mobx";
import { InputHandler } from "utils";

export default class TransactionCreater {
  coin: Coin | null = null;
  balance: number = 0
  receiver?: IPerson | null = null; //
  destinationChain?: SupportedCoins

  addressInput = new InputHandler();
  memo = new InputHandler()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

	setCoin(coin: Coin | null) {
		this.coin = coin
    if(this.destinationChain === undefined) this.destinationChain = coin?.info.coin
	}
  setBalance(balance: number) {
    const coin = this.coin
    let actualBalance = balance
    if(coin && balance > coin.balance) actualBalance = coin.balance
    this.balance = actualBalance
  }
  setReceiver(receiver: IPerson) {
    this.receiver = receiver;
  }

  setMax() {
    if (this.coin?.balance) {
      this.balance = this.coin.balance;
    }
  }

  setDestinationChain(destinationChain: SupportedCoins | undefined)
  {
    this.destinationChain = destinationChain
  }

  get address() {
    return this.addressInput.value;
  }

  get isAddressValid() {
    // TODO: upd. this
    return !!this.address;
  }

  get isReady() {
    return !!this.coin && !!this.balance && this.isAddressValid && this.receiver;
  }

  create(): ITransaction | undefined {
    if (!!this.coin && !!this.balance && this.isAddressValid && this.receiver) {
      const { address, balance, coin, receiver } = this;
      return {
        address,
        balance,
        coin: coin.info,
        receiver,
      };
    }
  }
}
