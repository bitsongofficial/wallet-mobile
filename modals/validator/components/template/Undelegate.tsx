import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetHeader, Pagination } from "components/moleculs"
import { StepRecapUndelegate, StepSetAmount } from "../organisms"
import { UndelegateController } from "../../controllers"

type Props = {
	controller: UndelegateController
}

export default observer<Props>(({ controller }) => {
	const { steps, amountInput, from } = controller
	return (
		<View style={styles.container}>
			<BottomSheetHeader
				title={steps.title}
				subtitle={steps.active === 0 && "Insert BTSG"}
				Pagination={<Pagination acitveIndex={steps.active} count={2} />}
			/>

			{steps.active === 0 && amountInput.coin && (
				<StepSetAmount
					coin={amountInput.coin}
					amount={amountInput.value}
					onPressDelNum={amountInput.removeAmountNumber}
					onPressMax={amountInput.setMax}
					onPressNum={amountInput.addAmountNumber}
				/>
			)}

			{steps.active === 1 && (
				<StepRecapUndelegate amount={amountInput.value} coin={amountInput.coin} from={from} />
			)}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		flex: 1,
		paddingTop: 25,
	},
})
