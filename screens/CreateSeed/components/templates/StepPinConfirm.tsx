import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, SetPin } from "../organisms"
import { ScrollView } from "react-native-gesture-handler"
import { Pin } from "classes"

type Props = {
	pin: Pin
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ pin, isDisableNext, onPressBack, onPressNext }) => (
	<>
		<View>
			<Title style={styles.title}>Confirm PIN</Title>
			<Subtitle style={styles.subtitle}>
				This is the only way you will be able to {"\n"}
				recover your account. Please store it{"\n"}
				somewhere safe!
			</Subtitle>
		</View>

		<View style={styles.content}>
			<SetPin pin={pin} />
		</View>

		<Footer
			nextButtonText="Let’s Start"
			onPressBack={onPressBack}
			onPressNext={onPressNext}
			isDisableNext={isDisableNext}
		/>
	</>
))

const styles = StyleSheet.create({
	title: { marginTop: 50 },
	subtitle: { marginTop: 8 },
	content: {
		flex: 1,
		paddingTop: 50,
		paddingBottom: 35,
	},
})
