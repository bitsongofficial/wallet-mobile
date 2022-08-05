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
	const validators = store.validators
	const controller = new DelegateController()
	controller.setSelectedValidator(validator)
	openDelegate({
		controller: controller,
		onDone() {
			if(controller.selectedValidator != null)
			{
				navigation.push("Loader", {
					// @ts-ignore
					callback: async () => {
						if(controller.selectedValidator) return await validators.delegate(controller.selectedValidator, parseFloat(controller.amountInput.value))
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
			const validators = store.validators
			navigation.push("Loader", {
				// @ts-ignore
				callback: async () => {
					if(controller.from && controller.to) return await validators.redelegate(controller.from, controller.to, parseFloat(controller.amountInput.value))
				},
			})
		},
	})
}

export function openUndelegateWithValidator(validator: Validator, navigation: NativeStackNavigationProp<any>)
{
	const validators = store.validators
	const controller = new UndelegateController()
	controller.setFrom(validator)

	openUndelegate({
		controller,
		onDone() {
			navigation.push("Loader", {
				// @ts-ignore
				callback: async () => {
					if(controller.from) return await validators.undelegate(controller.from, parseFloat(controller.amountInput.value))
				},
			})
		},
	})
}