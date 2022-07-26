import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetHeader, Pagination } from "components/moleculs"
import { StepRecapDelegate, StepSetAmount, StepValidatorSelection } from "../organisms"
import { DelegateController } from "../../controllers"

type Props = {
	controller: DelegateController
}

export default observer<Props>(({ controller }) => {
	const { steps, amountInput, setSelectedValidator, selectedValidator } = controller
	return (
		<View style={styles.container}>
			<BottomSheetHeader
				title={steps.title}
				subtitle={steps.active === 0 && "Insert BTSG"}
				Pagination={<Pagination acitveIndex={steps.active} count={3} />}
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
				<StepValidatorSelection
					onPressValidator={setSelectedValidator}
					activeValidator={selectedValidator}
					//
				/>
			)}

			{steps.active === 2 && (
				<StepRecapDelegate
					selectedValidator={selectedValidator}
					coin={amountInput.coin}
					amount={amountInput.value}
				/>
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
