import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { InputHandler } from "utils"
import { Input } from "components/atoms"
import { Footer } from "../organisms"
import { Subtitle, Title } from "../atoms"
import { s, vs } from "react-native-size-matters"
import { ScrollView } from "react-native-gesture-handler"

type Props = {
	input: InputHandler
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ onPressBack, onPressNext, input, isDisableNext }) => (
	<>
		<ScrollView bounces={false} style={styles.flex1}>
			<Title style={styles.title}>Name Your Wallet</Title>
			<Subtitle style={styles.subtitle}>
				This is the only way you will be able to {"\n"}
				recover your account. Please store it{"\n"}
				somewhere safe!
			</Subtitle>
			<View style={styles.flex1}>
				<Input
					placeholder="Wallet Name"
					style={styles.input}
					inputStyle={styles.inputStyle}
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
		borderRadius: s(20),
		marginTop: vs(24),
	},
	inputStyle: {
		height: s(62),
		fontSize: s(14),
		lineHeight: s(18),
	},
})
