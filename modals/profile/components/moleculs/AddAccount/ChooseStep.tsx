import { Agreement, Icon2, IconName } from "components/atoms"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { Title } from "../../atoms"

type ChooseStepProps = {
	onPressCreate(): void
	onPressImport(): void
}

export default ({ onPressCreate, onPressImport }: ChooseStepProps) => (
	<>
		<Title style={styles.title}>Add a new account</Title>
		<View style={styles.buttons}>
			<ButtonChoose
				icon="wallet"
				text="Create Account"
				onPress={onPressCreate}
				style={{ marginBottom: 12 }}
			/>
			<ButtonChoose icon="wallet" text="Import Mnemonics" onPress={onPressImport} />
		</View>
		<Agreement style={styles.agreements} />
	</>
)

type ButtonProps = {
	icon: IconName
	text: string
	style?: StyleProp<ViewStyle>
	onPress?(): void
}

const ButtonChoose = ({ icon, text, style, onPress }: ButtonProps) => (
	<TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
		<View style={styles.left}>
			<Icon2 name={icon} style={styles.icon} stroke={hexAlpha(COLOR.White, 50)} size={20} />
			<Text style={styles.text}>{text}</Text>
		</View>

		<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",

		marginBottom: 30,
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

	buttons: {
		marginBottom: 30,
	},
	agreements: {
		paddingHorizontal: 8,
		color: "#5C5B77",
	},

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
})
