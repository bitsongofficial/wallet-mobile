import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"
import { RadioButton } from "screens/Profile/components/atoms"
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
		borderRadius: s(10),
		overflow: "hidden",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: s(10),
		paddingHorizontal: s(8),
	},
	row: { flexDirection: "row", alignItems: "center" },
	avatar: {
		width: s(32),
		height: s(32),
		borderRadius: s(32),
		backgroundColor: COLOR.Dark3,

		marginRight: s(40),
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(15),
		lineHeight: s(19),
		color: COLOR.White,
	},
})
