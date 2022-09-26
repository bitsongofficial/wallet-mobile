import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, SetPin } from "../organisms"
import { Pin } from "classes"
import { vs } from "react-native-size-matters"
import { TitledParagraph } from "components/moleculs"

type Props = {
	pin: Pin
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ pin, onPressBack, onPressNext, isDisableNext }) => (
	<>
		<TitledParagraph
			title="Set PIN"
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
			onPressBack={onPressBack}
			onPressNext={onPressNext}
			nextButtonText="Continue"
			isDisableNext={isDisableNext}
		/>
	</>
))

const styles = StyleSheet.create({
	title: { marginTop: vs(50) },
	content: {
		flex: 1,
	},
})
