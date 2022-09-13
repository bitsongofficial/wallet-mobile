import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, PhraseInput } from "../organisms"
import { Phrase } from "classes"
import { ScrollView } from "react-native-gesture-handler"
import { useCallback, useRef } from "react"
import { Button } from "components/atoms"
import * as Clipboard from "expo-clipboard"
import { useKeyboard } from "@react-native-community/hooks"
import { s, vs } from "react-native-size-matters"

type Props = {
	phrase: Phrase
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ phrase, onPressBack, onPressNext, isDisableNext }) => {
	const scrollview = useRef<ScrollView>(null)
	const scrollingEnd = useCallback(() => scrollview.current?.scrollToEnd(), [])

	const pasteFromClipboard = useCallback(async () => {
		const clipboard = await Clipboard.getStringAsync() // TODO: Check, why not working
		// controller.phrase.setWords(clipboard.split(/^.+\w+\d+(\s+[\sa-zA-Z]+)$/));
		phrase.setWords(clipboard.split(" "))
	}, [phrase])

	const { keyboardShown } = useKeyboard()
	return (
		<>
			<View style={styles.text}>
				<Title style={styles.title}>Import your Mnemonic</Title>
				<Subtitle style={styles.subtitle}>
					This is the only way you will be able to {"\n"}
					recover your account. Please store it{"\n"}
					somewhere safe!
				</Subtitle>
			</View>

			<View
				// ref={scrollview}
				style={styles.scrollview}
				// onContentSizeChange={scrollingEnd}
				contentContainerStyle={styles.scrollviewContent}
			>
				<View style={styles.paste}>
					<Button
						text="Paste"
						contentContainerStyle={styles.buttonContent}
						textStyle={styles.buttonText}
						onPress={pasteFromClipboard}
					/>
				</View>
				<PhraseInput phrase={phrase} inputStyle={{ marginHorizontal: 30 }} />
			</View>

			{!keyboardShown && (
				<Footer
					nextButtonText="Continue"
					isDisableNext={isDisableNext}
					onPressBack={onPressBack}
					onPressNext={onPressNext}
					style={styles.mh30}
				/>
			)}
		</>
	)
})

const styles = StyleSheet.create({
	title: { marginTop: vs(50) },
	subtitle: { marginTop: vs(8) },
	text: { paddingHorizontal: s(30), marginBottom: vs(32) },

	mh30: { marginHorizontal: s(30) },

	scrollview: { flex: 1 },
	scrollviewContent: {
		flexGrow: 1,
		paddingBottom: vs(16),
		paddingTop: vs(40),
	},
	paste: {
		width: 65,
		marginHorizontal: 30,
		marginBottom: 24,
	},
	buttonContent: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 15,
	},
})
