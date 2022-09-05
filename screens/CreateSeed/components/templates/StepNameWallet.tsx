import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { InputHandler } from "utils"
import { Input } from "components/atoms"
import { Footer } from "../organisms"
import { Subtitle, Title } from "../atoms"

type Props = {
	input: InputHandler
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ onPressBack, onPressNext, input, isDisableNext }) => (
	<>
		<Title style={styles.title}>Name Your Wallet</Title>
		<Subtitle style={styles.subtitle}>
			This is the only way you will be able to {"\n"}
			recover your account. Please store it{"\n"}
			somewhere safe!
		</Subtitle>
		<View style={{ flex: 1 }}>
			<Input
				placeholder="Wallet Name"
				style={styles.input}
				inputStyle={styles.inputStyle}
				value={input.value}
				onChangeText={input.set}
			/>
		</View>
		<Footer
			onPressBack={onPressBack}
			onPressNext={onPressNext}
			nextButtonText="Continue"
			isDisableNext={isDisableNext}
		/>
	</>
))

const styles = StyleSheet.create({
	title: { marginTop: 50 },
	subtitle: { marginTop: 8 },
	input: {
		borderRadius: 20,
		marginTop: 24,
	},
	inputStyle: { height: 62 },
})
