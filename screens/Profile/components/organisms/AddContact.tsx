import { useCallback, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import * as Clipboard from "expo-clipboard"
import { Steps } from "classes"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Search, Subtitle, Title } from "../atoms"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ButtonAvatar } from "../moleculs"
import { useStore } from "hooks"
import { isValidAddress } from "core/utils/Address"

type Props = {
	close(): void
	steps: Steps
	onPressBack(): void
	onPressScan(): void
	inputWallet: InputHandler
	inputName: InputHandler
}

export default observer<Props>(
	({ close, steps, onPressBack, onPressScan, inputName, inputWallet }) => {
		const { contacts } = useStore()
		// ----------- Input ----------

		const pasteFromClipboard = useCallback(
			async () => inputWallet.set(await Clipboard.getStringAsync()),
			[],
		)

		// ------- Image ----------

		const [image, setImage] = useState<string>()

		const source = useMemo(() => (image ? { uri: image } : null), [image])

		// --------- Steps ------------

		const next = useCallback(() => {
			if (steps.title === "Add") {
				steps.goTo("Name")
			} else if (steps.title === "Name") {
				steps.goTo("Avatar")
			}
		}, [])

		const createContact = useCallback(() => {
			contacts.addContact({
				address: inputWallet.value.trim(),
				name: inputName.value.trim(),
				avatar: image, //  if skip create avatar neededr
			})
			close()
		}, [image])

		return (
			<View style={styles.container}>
				{steps.title === "Add" && (
					<>
						<Title style={styles.title}>Add Contact</Title>
						<Search
							loupe={false}
							style={styles.search}
							placeholder="Public Address"
							value={inputWallet.value}
							onChangeText={inputWallet.set}
							Right={
								<TouchableOpacity style={styles.iconTouchable} onPress={onPressScan}>
									<Icon2 name="qr_code" size={18} stroke={COLOR.RoyalBlue} />
								</TouchableOpacity>
							}
						/>
						<Subtitle style={styles.subtitle}>
							Access VIP experiences, exclusive previews,{"\n"}
							finance your own and have your say.
						</Subtitle>
					</>
				)}

				{steps.title === "Name" && (
					<>
						<Title style={styles.title}>Name your Contact</Title>
						<Search
							loupe={false}
							value={inputName.value}
							onChangeText={inputName.set}
							style={styles.search}
							placeholder="Write a name"
						/>
						<Subtitle style={styles.subtitle}>
							Access VIP experiences, exclusive previews,{"\n"}
							finance your own and have your say.
						</Subtitle>
					</>
				)}

				{steps.title === "Avatar" && (
					<>
						<Title style={styles.title}>Edit Profile Photo</Title>

						<View style={styles.avatar}>
							<ButtonAvatar source={source} onChange={setImage} />
						</View>
					</>
				)}

				<View style={styles.footer}>
					<View style={styles.footer_2}>
						<ButtonBack onPress={onPressBack} />
						{steps.title !== "Avatar" ? (
							<Button
								text="Continue"
								disable={(steps.title === "Name" && inputName.value.length < 4) || (steps.title === "Add" && !isValidAddress(inputWallet.value.trim()))}
								onPress={next}
								contentContainerStyle={styles.buttonContent}
								textStyle={styles.buttonText}
							/>
						) : (
							<Button
								text={image ? "Save" : "Skip"}
								onPress={createContact}
								contentContainerStyle={styles.buttonContent}
								textStyle={styles.buttonText}
							/>
						)}
					</View>
				</View>
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		// alignItems: "center",
		marginTop: 15,
		marginHorizontal: 26,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
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

	avatar: {
		alignItems: "center",
	},

	search: {
		marginBottom: 24,
	},

	iconTouchable: {
		padding: 23,
	},

	footer: {
		flexGrow: 1,
		justifyContent: "flex-end",
		marginTop: 20,
	},

	footer_1: {
		alignItems: "center",
	},
	footer_2: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	buttonContent: {
		paddingHorizontal: 31,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 14,
		lineHeight: 18,
	},
})
