import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { InputHandler } from "utils"
import { Input } from "components/atoms"
import { Footer } from "../organisms"
import { vs } from "react-native-size-matters"
import { ScrollView } from "react-native-gesture-handler"
import { TitledParagraph } from "components/moleculs"

type Props = {
	input: InputHandler
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ onPressBack, onPressNext, input, isDisableNext }) => (
	<>
		<ScrollView bounces={false} style={styles.flex1}>
			<TitledParagraph
				title={"Name Your Wallet"}
				text={"This is the only way you will be able to \n recover your account. Please store it\n somewhere safe!"}
				style={styles.title}
			></TitledParagraph>
			<View style={styles.flex1}>
				<Input
					placeholder="Wallet Name"
					style={styles.input}
					value={input.value}
					onChangeText={input.set}
				/>
			</View>
		</ScrollView>
		<Footer
			onPressBack={onPressBack}
			onPressNext={onPressNext}
			nextButtonText="Continue"
			isDisableNext={isDisableNext}
		/>
	</>
))

const styles = StyleSheet.create({
	title: { marginTop: vs(50) },
	subtitle: { marginTop: vs(8) },
	flex1: { flex: 1 },
	input: {
		marginTop: vs(24),
	},
})
