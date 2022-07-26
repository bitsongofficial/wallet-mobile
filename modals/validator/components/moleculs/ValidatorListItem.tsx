import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { RadioButton } from "screens/Profile/components/atoms" // TODO: make common component
import { COLOR } from "utils"

type Props = {
	name: string
	avatar: string
	style?: StyleProp<ViewStyle>
	isActive?: boolean
	onPress?(): void
}

export default ({ avatar, name, style, isActive, onPress }: Props) => (
	<View style={[styles.container, style]}>
		<RectButton style={styles.button} onPress={onPress}>
			<View style={styles.row}>
				{/* <Image /> */}
				<View style={styles.avatar} />
				<Text style={styles.name} children={name} />
			</View>
			<RadioButton isActive={isActive} />
		</RectButton>
	</View>
)

const styles = StyleSheet.create({
	container: {
		borderRadius: 10,
		overflow: "hidden",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
		paddingHorizontal: 8,
	},
	row: { flexDirection: "row", alignItems: "center" },
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 32,
		backgroundColor: "red",

		marginRight: 40,
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 15,
		lineHeight: 19,
		color: COLOR.White,
	},
})
