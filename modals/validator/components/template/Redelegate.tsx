import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetHeader, Pagination } from "components/moleculs"
import { StepRecapRedelegate, StepSetAmount, StepValidatorSelection } from "../organisms"
import { RedelegateController } from "../../controllers"

type Props = {
	controller: RedelegateController
}

export default observer<Props>(({ controller }) => {
	const { amountInput, steps, from, to, setTo } = controller
	console.log("from", from)
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
				<StepValidatorSelection onPressValidator={setTo} activeValidator={to} />
			)}

			{steps.active === 2 && (
				<StepRecapRedelegate
					amount={amountInput.value}
					coin={amountInput.coin}
					from={from}
					to={to}
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
