import { useCallback, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import * as Clipboard from "expo-clipboard"
import { COLOR } from "utils"
import { Button, ButtonBack } from "components/atoms"
import { InputWord } from "components/moleculs"
import { BottomSheetFooter, BottomSheetFooterProps } from "@gorhom/bottom-sheet"
import { ChooseStep, CreateStep, ImportStep, InputNameStep } from "../moleculs/AddAccount"
import { ControllerAddAccount } from "modals/profile/controllers"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type Props = { controller: ControllerAddAccount }

export default observer<Props>(({ controller }) => {
	const { phrase, steps, nameInput } = controller
	// --------- Steps ------------
	const openCreate = useCallback(() => steps.goTo("Create"), [])
	const openImport = useCallback(() => steps.goTo("Import"), [])

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

	return (
		<View style={styles.wrapper}>
			{steps.title === "Choose" && (
				<ChooseStep onPressCreate={openCreate} onPressImport={openImport} />
			)}
			{steps.title === "Create" && (
				<CreateStep isHidden={isHidden} phrase={phrase} onPressToggle={toggle} />
			)}
			{steps.title === "Name" && <InputNameStep input={nameInput} />}
			{steps.title === "Import" && <ImportStep onPressPaste={paste} phrase={phrase} />}
		</View>
	)
})

type FooterProps = BottomSheetFooterProps & {
	controller: ControllerAddAccount
	onPressAddWallet(): void
	onPressBack(): void
}

export const Footer = observer(
	({ animatedFooterPosition, controller, onPressAddWallet, onPressBack }: FooterProps) => {
		const { t } = useTranslation()
		const { phrase, steps, nameInput } = controller

		const openName = useCallback(() => steps.goTo("Name"), [])

		return (
			<BottomSheetFooter animatedFooterPosition={animatedFooterPosition} bottomInset={24}>
				<View style={{ marginBottom: 8, marginHorizontal: 30 }}>
					{steps.title === "Import" &&
						(phrase.words.length === 12 || phrase.words.length === 24 ? (
							<Button
								text="Done"
								onPress={openName}
								textStyle={styles.buttonContinueText}
								contentContainerStyle={styles.buttonContinueContent}
							/>
						) : (
							<InputWord
								bottomsheet
								onSubmitEditing={() => {
									phrase.inputSubmit()
									// phrase.isValid && steps.goTo("Name") // TODO: need upd. isValid
								}}
								phrase={phrase}
							/>
						))}

					{steps.title === "Create" && (
						<View style={{ alignItems: "center", justifyContent: "center" }}>
							<Button
								text={t("Continue")}
								contentContainerStyle={styles.buttonContinueContent}
								textStyle={styles.buttonContinueText}
								onPress={openName}
							/>
						</View>
					)}

					{steps.title === "Name" && (
						<View style={styles.footer}>
							<ButtonBack onPress={onPressBack} />
							<View style={{ width: "66%" }}>
								<Button
									text={t("AddAccount")}
									textAlignment="center"
									disable={!phrase.isValid || nameInput.value.length < 3}
									contentContainerStyle={styles.buttonContinueContent}
									textStyle={styles.buttonContinueText}
									onPress={onPressAddWallet}
								/>
							</View>
						</View>
					)}
				</View>
			</BottomSheetFooter>
		)
	},
)

// ----------------------

const styles = StyleSheet.create({
	wrapper: {
		marginTop: vs(15),
		marginHorizontal: s(26),
		flex: 1,
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",
		marginBottom: vs(30),
	},
	subtitle: {
		fontSize: s(14),
		lineHeight: s(18),
		textAlign: "center",
		opacity: 0.3,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: vs(26),
	},
	// ------ Footer -----

	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	buttonContinueContent: {
		paddingHorizontal: s(40),
		paddingVertical: s(18),
	},
	buttonContinueText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
})
