import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, SetPin } from "../organisms"
import { ScrollView } from "react-native-gesture-handler"
import { Pin } from "classes"
import { vs } from "react-native-size-matters"
import { TitledParagraph } from "components/moleculs"

type Props = {
	pin: Pin
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ pin, isDisableNext, onPressBack, onPressNext }) => (
	<>
		<TitledParagraph
			title="Confirm PIN"
			style={styles.title}
		>
			This is the only way you will be able to {"\n"}
			recover your account. Please store it{"\n"}
			somewhere safe!
		</TitledParagraph>

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
	title: { marginTop: vs(50) },
	content: { flex: 1 },
})
