import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SupportedCoins } from "constants/Coins";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { RedelegateData } from "core/types/coin/cosmos/RedelegateData";
import { Validator } from "core/types/coin/cosmos/Validator";
import { CoinClasses } from "core/types/coin/Dictionaries";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { convertRateFromDenom } from "core/utils/Coin";
import navigation from "navigation";
import { store } from "stores/Store";
import { DelegateController, RedelegateController, UndelegateController } from "./controllers";
import openDelegate from "./openDelegate";
import openRedelegate from "./openRedelegate";
import openUndelegate from "./openUndelegate";

export function openDelegateWithValidator(validator: Validator, navigation: NativeStackNavigationProp<any>)
{
	const wallet = store.wallet
	const controller = new DelegateController()
	controller.setSelectedValidator(validator)
	openDelegate({
		controller: controller,
		onDone() {
			const activeWallet = wallet.activeWallet
			const validator = controller.selectedValidator
			if(activeWallet && validator)
			{
				const chain = validator.chain ?? SupportedCoins.BITSONG
				const coin = CoinClasses[chain]
				const delegateData: DelegateData = {
					delegator: activeWallet.wallets[chain],
					validator,
					amount: {
						amount: (parseFloat(controller.amountInput.value) * convertRateFromDenom(coin.denom())).toString(),
						denom: coin.denom()
					}
				}
				navigation.push("Loader", {
					// @ts-ignore
					callback: async () => {
						await coin.Do(CoinOperationEnum.Delegate, delegateData)
					},
				})
			}
		},
	})
}

export function openRedelegateWithValidator(validator: Validator, navigation: NativeStackNavigationProp<any>)
{
	const wallet = store.wallet
	const controller = new RedelegateController()
	controller.setFrom(validator)

	openRedelegate({
		controller,
		onDone() {
			const activeWallet = wallet.activeWallet
			const validator = controller.from
			if(activeWallet && validator && controller.to)
			{
				const chain = validator.chain ?? SupportedCoins.BITSONG
				const coin = CoinClasses[chain]
				const delegateData: RedelegateData = {
					delegator: activeWallet.wallets[chain],
					validator,
					newValidator: controller.to,
					amount: {
						amount: (parseFloat(controller.amountInput.value) * convertRateFromDenom(coin.denom())).toString(),
						denom: coin.denom()
					}
				}
				navigation.push("Loader", {
					// @ts-ignore
					callback: async () => {
						await coin.Do(CoinOperationEnum.Undelegate, delegateData)
					},
				})
			}
		},
	})
}

export function openUndelegateWithValidator(validator: Validator, navigation: NativeStackNavigationProp<any>)
{
	const wallet = store.wallet
	const controller = new UndelegateController()
	controller.setFrom(validator)

	openUndelegate({
		controller,
		onDone() {
			const activeWallet = wallet.activeWallet
			const validator = controller.from
			if(activeWallet && validator)
			{
				const chain = validator.chain ?? SupportedCoins.BITSONG
				const coin = CoinClasses[chain]
				const delegateData: DelegateData = {
					delegator: activeWallet.wallets[chain],
					validator,
					amount: {
						amount: (parseFloat(controller.amountInput.value) * convertRateFromDenom(coin.denom())).toString(),
						denom: coin.denom()
					}
				}
				navigation.push("Loader", {
					// @ts-ignore
					callback: async () => {
						await coin.Do(CoinOperationEnum.Undelegate, delegateData)
					},
				})
			}
		},
	})
}