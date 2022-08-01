import { useCallback, useEffect, useMemo, useState } from "react"
import { StyleSheet, TextInputProps, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import * as Clipboard from "expo-clipboard"
import { useStore } from "hooks"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { Phrase, Steps } from "classes"
import { Button } from "components/atoms"
import { InputWord } from "components/moleculs"
import { BottomSheetFooter, BottomSheetFooterProps } from "@gorhom/bottom-sheet"
import { ChooseStep, CreateStep, ImportStep, InputNameStep } from "../moleculs/AddAccount"

type Props = {
	steps: Steps<"Choose" | "Create" | "Name" | "Import">
	phrase: Phrase
	close(): void
}

export default observer<Props>(({ close, phrase, steps }) => {
	const { wallet } = useStore()
	const insets = useSafeAreaInsets()
	// --------- Steps ------------
	const openCreate = useCallback(() => steps.goTo("Create"), [])
	const openImport = useCallback(() => steps.goTo("Import"), [])
	const openName = useCallback(() => steps.goTo("Name"), [])

	const goBack = useCallback(() => {
		if (steps.active === 0) {
			close()
		} else {
			steps.goBack()
		}
	}, [])

	// --------- Phrase ----------

	const [isHidden, setHidden] = useState(true)
	const toggle = useCallback(() => setHidden((value) => !value), [])

	useEffect(() => setHidden(true), [steps.active])

	const paste = useCallback(async () => {
		const clipboard = await Clipboard.getStringAsync()
		const words = clipboard.split(/[^a-zа-я$]+/gi).filter((w) => w)

		if (words.length) {
			phrase.setWords(words)
			phrase.setActiveIndex(phrase.words.length - 1)
		}
	}, [phrase])

	const handlePressGo = useCallback(() => {
		phrase.inputSubmit()
		phrase.isValid && steps.goTo("Name")
	}, [])

	// ---------- Name -----------

	const input = useMemo(() => new InputHandler(), [])

	const saveWallet = useCallback(() => {
		if (input.value && phrase.isValid) {
			wallet.newCosmosWallet(input.value, phrase.words)
			close()
		}
	}, [])

	return (
		<>
			{steps.title === "Choose" && (
				<View style={[styles.wrapper]}>
					<ChooseStep onPressCreate={openCreate} onPressImport={openImport} />
				</View>
			)}

			{steps.title === "Create" && (
				<View style={[styles.wrapper]}>
					<CreateStep isHidden={isHidden} phrase={phrase} onPressToggle={toggle} />
					<View style={[styles.footer, { bottom: insets.bottom }]}>
						<Button
							text="Continue"
							contentContainerStyle={styles.buttonContinueContent}
							textStyle={styles.buttonContinueText}
							onPress={openName}
						/>
					</View>
				</View>
			)}

			{steps.title === "Name" && (
				<View style={[styles.wrapper]}>
					<InputNameStep
						input={input}
						isAddDisable={!phrase.isValid || input.value.length < 3}
						onPressAdd={saveWallet}
						onPressBack={goBack}
					/>
				</View>
			)}

			{steps.title === "Import" && (
				<>
					<ImportStep onPressPaste={paste} phrase={phrase} />
					<View style={[styles.footer, { bottom: insets.bottom }]}>
						<Button
							text="Continue"
							contentContainerStyle={styles.buttonContinueContent}
							textStyle={styles.buttonContinueText}
							onPress={openName}
						/>
					</View>
				</>
			)}
		</>
	)
})

type FooterProps = BottomSheetFooterProps & {
	phrase: Phrase
	onPressDone(): void
	onPressInputKeyboardSubmit: TextInputProps["onSubmitEditing"]
}

const Footer = observer(
	({ phrase, animatedFooterPosition, onPressDone, onPressInputKeyboardSubmit }: FooterProps) => {
		return (
			<BottomSheetFooter animatedFooterPosition={animatedFooterPosition} bottomInset={24}>
				{phrase.words.length === 16 ? (
					<Button
						text="Done"
						onPress={onPressDone}
						style={{ marginHorizontal: 26 }}
						textStyle={styles.buttonContinueText}
						contentContainerStyle={styles.buttonContinueContent}
					/>
				) : (
					<InputWord
						bottomsheet
						onSubmitEditing={onPressInputKeyboardSubmit}
						phrase={phrase}
						style={{ marginHorizontal: 16, marginBottom: 16 }}
					/>
				)}
			</BottomSheetFooter>
		)
	},
)

// ----------------------

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 15,
		marginHorizontal: 26,
		flex: 1,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",

		marginBottom: 30,
	},
	subtitle: {
		fontSize: 14,
		lineHeight: 18,
		textAlign: "center",
		opacity: 0.3,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: 26,
	},

	phrase: {
		alignItems: "center",
	},

	buttons: {
		marginBottom: 30,
	},
	agreements: {
		paddingHorizontal: 8,
		color: "#5C5B77",
	},

	//  ------- Button ----------
	button: {
		flexGrow: 1,
		justifyContent: "flex-end",
		padding: 16,
	},

	buttonContainer: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		height: 62,
		borderRadius: 20,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		paddingHorizontal: 22,
	},
	buttonToggle: {
		marginBottom: 25,
	},
	buttonToggleContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	// -----

	left: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 20,
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
	},

	// ------ Footer -----

	footer: {
		flexGrow: 1,
		justifyContent: "flex-end",
		alignItems: "center",

		position: "absolute",
		bottom: 20,
		paddingBottom: 16,
		width: "100%",
	},

	buttonContinueContent: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
	buttonContinueText: {
		fontSize: 14,
		lineHeight: 18,
	},
})
