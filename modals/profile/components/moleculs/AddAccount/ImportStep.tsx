import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Phrase } from "classes"
import { COLOR } from "utils"
import { Button } from "components/atoms"
import { PhraseHorisontal } from "components/moleculs"
import { Title } from "../../atoms"
import { s, vs } from "react-native-size-matters"

type CreateStepProps = {
	onPressPaste(): void
	phrase: Phrase
}

export default observer(({ phrase, onPressPaste }: CreateStepProps) => (
	<>
		<View style={styles.wrapper}>
			<Title style={styles.title}>Import Mnemonics</Title>
			<Text style={styles.caption}>
				This is the only way you will be able to recover your account. Please store it somewhere
				safe!
			</Text>
		</View>
		{phrase.words.length > 0 ? (
			<PhraseHorisontal phrase={phrase} contentContainerStyle={styles.phrase} />
		) : (
			<View style={{ alignItems: "center" }}>
				<Button
					text="Paste"
					onPress={onPressPaste}
					textStyle={styles.buttonText}
					contentContainerStyle={styles.buttonContent}
				/>
			</View>
		)}
	</>
))

const styles = StyleSheet.create({
	wrapper: {
		marginTop: vs(15),
		marginHorizontal: s(26),
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",

		marginBottom: vs(30),
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: vs(20),
	},
	phrase: {
		// paddingHorizontal: s(26),
	},
	buttonText: {
		fontSize: s(12),
	},
	buttonContent: {
		paddingHorizontal: s(16),
		paddingVertical: s(8),
	},
})
