import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, SetPin } from "../organisms"
import { Pin } from "classes"
import { vs } from "react-native-size-matters"

type Props = {
	pin: Pin
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ pin, onPressBack, onPressNext, isDisableNext }) => (
	<>
		<Title style={styles.title}>Set PIN</Title>
		<Subtitle style={styles.subtitle}>
			This is the only way you will be able to {"\n"}
			recover your account. Please store it{"\n"}
			somewhere safe!
		</Subtitle>

		<View style={styles.content}>
			<SetPin pin={pin} />
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
	title: { marginTop: vs(50) },
	subtitle: { marginTop: vs(8) },
	content: {
		flex: 1,
	},
})
