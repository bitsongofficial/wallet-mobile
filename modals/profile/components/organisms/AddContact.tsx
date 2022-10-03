import { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import { Steps } from "classes"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { StyledInput, Subtitle, Title } from "../atoms"
import { RectButton } from "react-native-gesture-handler"
import { ButtonAvatar } from "../moleculs"
import { isValidAddress } from "core/utils/Address"
import { s, vs } from "react-native-size-matters"
import { makeAutoObservable } from "mobx"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export class Controller {
	steps = new Steps(["Add", "Name", "Avatar"])
	inputWallet = new InputHandler()
	inputName = new InputHandler()

	image: string | null = null
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setImage(link: string) {
		this.image = link
	}
}

type Props = {
	controller: Controller
	onPressScan(): void
}

export default observer<Props>(({ onPressScan, controller }) => {
	const { inputName, inputWallet, steps } = controller

	const source = useMemo(
		() => (controller.image ? { uri: controller.image } : null),
		[controller.image],
	)

	return (
		<View style={styles.container}>
			{steps.title === "Add" && (
				<>
					<Title style={styles.title}>Add Contact</Title>
					<StyledInput
						style={styles.search}
						placeholder="Public Address"
						value={inputWallet.value}
						onChangeText={inputWallet.set}
						Right={
							<RectButton style={styles.iconTouchable} onPress={onPressScan}>
								<Icon2 name="qr_code" size={18} stroke={COLOR.RoyalBlue} />
							</RectButton>
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
					<StyledInput
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
						<ButtonAvatar source={source} onChange={controller.setImage} />
					</View>
				</>
			)}
		</View>
	)
})

type FooterProps = {
	onPressBack(): void
	onPressSave(): void
	onPressNext(): void
	controller: Controller
}

export const Footer = observer(
	({ onPressBack, controller, onPressNext, onPressSave }: FooterProps) => {
		const { steps, inputName, inputWallet } = controller

		const insets = useSafeAreaInsets()

		return (
			<View style={[styles.footer, { marginBottom: insets.bottom || 8 }]}>
				<ButtonBack onPress={onPressBack} />
				{steps.title !== "Avatar" ? (
					<Button
						text="Continue"
						disable={
							(steps.title === "Name" && inputName.value.length < 4) ||
							(steps.title === "Add" && !isValidAddress(inputWallet.value.trim()))
						}
						onPress={onPressNext}
						contentContainerStyle={styles.buttonContent}
						textStyle={styles.buttonText}
					/>
				) : (
					<Button
						text={controller.image ? "Save" : "Skip"}
						onPress={onPressSave}
						contentContainerStyle={styles.buttonContent}
						textStyle={styles.buttonText}
					/>
				)}
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		marginTop: vs(15),
		marginHorizontal: s(26),
		flex: 1,
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",
		marginBottom: vs(36),
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		opacity: 0.5,

		textAlign: "center",

		marginBottom: vs(18),
	},

	avatar: { alignItems: "center" },
	search: { marginBottom: vs(24) },

	iconTouchable: {
		paddingHorizontal: s(23),
		alignItems: "center",
		justifyContent: "center",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: HORIZONTAL_WRAPPER,
	},

	buttonContent: {
		paddingHorizontal: s(31),
		paddingVertical: s(18),
	},
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
})
