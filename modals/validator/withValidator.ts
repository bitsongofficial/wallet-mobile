import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Validator } from "core/types/coin/cosmos/Validator";
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
		async onDone() {
			if(controller.selectedValidator != null)
			{
				return await validators.delegate(controller.selectedValidator, parseFloat(controller.amountInput.value))
			}
			return false
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
		async onDone() {
			const validators = store.validators
			if(controller.from && controller.to)
				return await validators.redelegate(controller.from, controller.to, parseFloat(controller.amountInput.value))
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
		async onDone() {
			if(controller.from)
				return await validators.undelegate(controller.from, parseFloat(controller.amountInput.value))
		},
	})
}