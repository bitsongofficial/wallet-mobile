import { useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { RectButton } from "react-native-gesture-handler"
import { COLOR, InputHandler } from "utils"
import { makeAutoObservable } from "mobx"
import { Steps } from "classes"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Search, Title } from "../atoms"
import { ButtonAvatar } from "../moleculs"
import { Contact } from "stores/ContactsStore"

export class Controller {
	steps = new Steps(["Data", "Photo"])
	inputAddress = new InputHandler()
	inputNickname = new InputHandler()
	image: string | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setImage(image: string | null) {
		this.image = image
	}
}

type Props = {
	contact: Contact | null
	controller: Controller
	onPressScan(): void
}

export default observer<Props>(({ contact, onPressScan, controller }) => {
	const { steps, inputAddress, inputNickname, image } = controller

	const source = useMemo(
		() => (contact?.avatar || image ? { uri: image || contact?.avatar } : null),
		[image],
	)

	return (
		<View style={styles.container}>
			{steps.title === "Data" && (
				<>
					<Title style={styles.title}>Edit Contact</Title>

					<View style={{ marginBottom: 24 }}>
						<Text style={styles.label}>Edit address</Text>
						<Search
							value={inputAddress.value}
							onChangeText={inputAddress.set}
							loupe={false}
							Right={
								<RectButton style={styles.button_qr} onPress={onPressScan}>
									<Icon2 name="qr_code" stroke={COLOR.RoyalBlue} size={22} />
								</RectButton>
							}
						/>
					</View>

					<View>
						<Text style={styles.label}>Edit name</Text>
						<Search value={inputNickname.value} onChangeText={inputNickname.set} loupe={false} />
					</View>
				</>
			)}

			{steps.title === "Photo" && (
				<>
					<Title style={styles.title}>Edit Profile Photo</Title>
					<View style={styles.avatar}>
						<ButtonAvatar source={source} onChange={controller.setImage} />
					</View>
				</>
			)}
		</View>
	)
})

type FooterProps = {
	steps: Steps
	onPressBack(): void
	onPressNext(): void
	onPressDone(): void
}

export const Footer = observer(({ steps, onPressBack, onPressDone, onPressNext }: FooterProps) => (
	<View style={styles.footer}>
		<View style={styles.buttons}>
			<ButtonBack onPress={onPressBack} />

			{steps.title === "Data" ? (
				<Button
					text="Continue"
					onPress={onPressNext}
					textStyle={styles.buttonText}
					contentContainerStyle={styles.buttonContent}
				/>
			) : (
				<Button
					onPress={onPressDone}
					text="Save"
					textStyle={styles.buttonText}
					contentContainerStyle={styles.buttonContent}
				/>
			)}
		</View>
	</View>
))

const styles = StyleSheet.create({
	container: {
		marginTop: 15,
		marginHorizontal: 26,
		marginBottom: 32,
		flex: 1,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
		marginBottom: 36,
	},
	label: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,

		marginBottom: 8,
	},
	avatar: {
		alignItems: "center",
	},

	// ------ Footer ----------

	footer: {
		flexGrow: 1,
		justifyContent: "flex-end",
		marginHorizontal: 26,
		marginBottom: 8,
	},

	button_qr: {
		padding: 23,
	},

	buttons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	button: { backgroundColor: COLOR.Dark2 },
	buttonContent: {
		paddingVertical: 18,
		paddingHorizontal: 46,
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
})
