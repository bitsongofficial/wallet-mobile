import { useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Steps } from "classes"
import { IValidator } from "classes/types"
import { BottomSheetHeader, Pagination } from "components/moleculs"
import { StepDelegationRecap, StepSetAmount, StepValidatorSelection } from "../organisms"

type Props = {
	steps: Steps
}

export default observer<Props>(({ steps }) => {
	const [choosed, setChoosed] = useState<IValidator>()
	return (
		<View style={styles.container}>
			<BottomSheetHeader
				title={steps.title}
				subtitle={steps.active === 0 && "Insert BTSG"}
				Pagination={<Pagination acitveIndex={steps.active} count={3} />}
			/>

			{steps.active === 0 && (
				<StepSetAmount
					amount=""
					onPressDelNum={() => {}}
					onPressMax={() => {}}
					onPressNum={() => {}}
				/>
			)}
			{steps.active === 1 && (
				<StepValidatorSelection
					//
					onPressValidator={setChoosed}
					activeValidator={choosed}
				/>
			)}
			{steps.active === 2 && <StepDelegationRecap />}
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
