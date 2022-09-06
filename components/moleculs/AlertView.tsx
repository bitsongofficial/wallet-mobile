import { Icon2 } from "components/atoms"
import { StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { COLOR } from "utils"

type AlertViewProps = {
	message?: string | null
}

export default ({ message }: AlertViewProps) => {
	const insets = useSafeAreaInsets()
	return (
		<View
			style={[
				styles.container,
				{
					height: "100%",
					paddingTop: insets.top,
				},
			]}
		>
			<View style={styles.content}>
				<Icon2 name="alert_circle" size={24} stroke={COLOR.White} style={styles.icon} />
				<Text style={styles.message}>{message || "Error"}</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Pink,
		position: "absolute",
		top: 0,
		width: "100%",
		paddingHorizontal: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	icon: { marginRight: 20 },
	message: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
	},
})
