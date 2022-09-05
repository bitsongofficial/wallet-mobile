import { useCallback } from "react"
import { StyleSheet, View } from "react-native"
import * as Clipboard from "expo-clipboard"
import { observer } from "mobx-react-lite"
import { InputHandler } from "utils"
import { Steps } from "classes"
import { Button } from "components/atoms"
import { Search, Subtitle, Title } from "../atoms"
import { isValidAddress } from "core/utils/Address"

export class Controller {
	inputWallet = new InputHandler()
	inputName = new InputHandler()
	steps = new Steps(["Address", "Name"])
}

type Props = {
	controller: Controller
}

export default observer<Props>(({ controller }) => {
	const { inputName, inputWallet, steps } = controller

	const pasteFromClipboard = useCallback(
		async () => inputWallet.set(await Clipboard.getStringAsync()),
		[],
	)

	return (
		<View style={styles.container}>
			{steps.title === "Address" && (
				<>
					<Title style={styles.title}>Add Watch Account</Title>
					<Search
						loupe={false}
						style={styles.search}
						placeholder="Public Address"
						value={inputWallet.value}
						onChangeText={inputWallet.set}
						Right={
							<Button
								text="Paste"
								onPress={pasteFromClipboard}
								style={styles.buttonPaste}
								contentContainerStyle={styles.buttonPasteContent}
							/>
						}
					/>
				</>
			)}
			{steps.title === "Name" && (
				<>
					<Title style={styles.title}>Name your Wallet</Title>
					<Search
						loupe={false}
						value={inputName.value}
						onChangeText={inputName.set}
						style={styles.search}
						placeholder="Write a name"
					/>
				</>
			)}

			<Subtitle style={styles.subtitle}>
				Insert the address you want to explore{"\n"} and discover data.
			</Subtitle>
		</View>
	)
})

type FooterProps = {
	controller: Controller
	onPressSave(): void
}

export const Footer = observer(({ controller, onPressSave }: FooterProps) => {
	const { inputWallet, steps, inputName } = controller
	return (
		<View style={styles.footer}>
			<View></View>
			{steps.title === "Address" && (
				<Button
					disable={!isValidAddress(inputWallet.value.trim())}
					text="Proceed"
					onPress={() => steps.goTo("Name")}
					contentContainerStyle={styles.buttonContent}
					textStyle={styles.buttonText}
				/>
			)}
			{steps.title === "Name" && (
				<Button
					disable={inputName.value.length < 4}
					text="Add Account"
					onPress={onPressSave}
					contentContainerStyle={styles.buttonContent}
					textStyle={styles.buttonText}
				/>
			)}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		marginTop: 15,
		marginHorizontal: 26,
		flex: 1,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,

		marginBottom: 36,
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		opacity: 0.5,

		textAlign: "center",

		marginBottom: 18,
	},

	search: {
		marginBottom: 24,
	},

	// -------- Button ----------
	buttonPaste: {
		marginHorizontal: 14,
	},
	buttonPasteContent: {
		paddingVertical: 8,
		paddingHorizontal: 16,
	},

	footer: {
		marginHorizontal: 26,
		alignItems: "center",
		marginBottom: 16,
	},

	buttonContent: {
		paddingHorizontal: 77,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 14,
		lineHeight: 18,
	},
})
