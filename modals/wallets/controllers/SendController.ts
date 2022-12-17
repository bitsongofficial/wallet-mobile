import { Steps } from "classes";
import Transaction from "classes/Transaction";
import TransactionCreater from "classes/Transaction/Creater";
import { SupportedCoins } from "constants/Coins";
import { makeAutoObservable } from "mobx";
import { store } from "stores/Store";

export enum SendSteps {
  Import="Insert Import",
  Receiver="Select Receiver",
  Recap="Send Recap",
  Coin="Select Coin",
  SourceNetwork="Select Network",
  DestinationNetwork="Select Destination Network",
}

export default class SendController {
  steps: Steps<SendSteps>;

  private currentInput = "0"
  private invertedInner = false

  creater = new Transaction.Creater();

  constructor(isIbc = false) {
    const innerSteps: SendSteps[] = [
      SendSteps.Import,
      SendSteps.Receiver,
      SendSteps.Recap,
      SendSteps.Coin,
      SendSteps.SourceNetwork,
    ]
    if(isIbc) {
      innerSteps.splice(1, 0, SendSteps.DestinationNetwork)
    }
    this.steps = new Steps(innerSteps)
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isIbc() {
    return this.steps.titles.includes(SendSteps.DestinationNetwork)
  }

  get readableInput () {
    return this.currentInput == "" ? "0" : this.currentInput
  }

  setCreater(creater: TransactionCreater)
  {
    this.creater = creater
  }

  private maxAvailableValue() {
    const balance = this.creater.getAssetBalanceFromStore()
    let max = 0
    if(balance)
    {
      max = balance
      if(this.inverted)
      {
        max = this.creater.getAssetFiatValueFromStore()
      }
    }

    return max
  }

  limitDecimal(val: string, limit: number)
  {
    
    const dot = val.indexOf(".")
    if(dot > -1) return val.substring(0, dot + limit + 1)
    return val
  }

  get fiat(): string {
    const balance = this.creater.balance
    if(balance !== undefined) return this.limitDecimal(this.creater.getFiatValue().toString(), 2)
    return ""
  }

  set fiat(value) {
    const f = parseFloat(value ?? 0)
    const denom = this.creater.asset?.denom
    if(denom)
    {
      const balance = store.coin.fromFIATToBalance(f, denom)
      if(balance !== undefined) this.creater.setBalance(balance)
    }
  }

  get balance () {
    const balance = this.creater.balance
    return balance ? this.limitDecimal(balance.toString(), 4) : "0"
  }

  set balance(value) {
    this.creater.setBalance(parseFloat(value ? value : "0"))
  }

  isValidNumberString(current: string, num: string) {
    return (num === "." && !current.includes(num)) || num !== ".";
  }

  setActive(value: string) {
    if(this.inverted) this.fiat = value
    else this.balance = value
  }

  addNumber(num: string) {
    const isDotIsOnce = this.isValidNumberString(this.currentInput, num)

    if (isDotIsOnce) {
      this.currentInput = (this.currentInput == "0" && num != ".") ? num : (this.currentInput + num)
      const max = this.maxAvailableValue()
      if(parseFloat(this.currentInput) > max) this.currentInput = max.toString()
      if(this.currentInput == "00") this.currentInput = "0"
      let limit = 2
      if(!this.inverted) limit = 5
      this.currentInput = this.limitDecimal(this.currentInput, limit)
      this.setActive(this.currentInput)
    }
  }

  removeNumber() {
    if(this.currentInput.length > 0)
    {
      this.currentInput = (this.currentInput.slice(0, -1))
      if(this.currentInput == "") this.currentInput = "0"
      this.setActive(this.currentInput)
    }
  }

  get inverted(): boolean {
    return this.invertedInner
  }

  set inverted(value: boolean) {
    if(this.inverted && !value) this.currentInput = this.balance
    else if (!this.inverted && value) this.currentInput = this.fiat
    this.invertedInner = value
  }

  invert() {
    this.inverted = !this.inverted
  }

	clear() {
		this.steps.clear()

		const asset = this.creater.asset
		this.creater = new Transaction.Creater()
		this.creater.setAsset(asset)
	}
  setMax() {
    this.creater.setMax()
    if(this.inverted) this.currentInput = this.creater.getAssetFiatValueFromStore().toString()
    else this.currentInput = this.balance
  }
}
