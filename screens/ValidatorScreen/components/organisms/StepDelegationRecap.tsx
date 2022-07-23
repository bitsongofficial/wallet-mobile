import { StyleSheet, Text, View } from "react-native"
import { COLOR } from "utils"

export default () => (
	<View style={styles.container}>
		<Text style={styles.title}>Amout to Delegate</Text>

		<Text style={styles.amount}>39.99125</Text>

		<View style={{ flexDirection: "row", alignItems: "flex-end" }}>
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: "row", marginBottom: 16 }}>
					<Text style={styles.blue}>currency</Text>
					<Text style={styles.white}>BTSG</Text>
				</View>
				<View style={{ flexDirection: "row" }}>
					<Text style={styles.blue}>stake to</Text>
					<Text style={styles.white}>Forbole</Text>
				</View>
			</View>

			<View style={styles.avatar} />
		</View>
	</View>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingVertical: 32,
		paddingHorizontal: 20,
		borderRadius: 20,
		marginTop: 36,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.RoyalBlue2,

		marginBottom: 12,
	},
	amount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
		color: COLOR.White,

		marginBottom: 8,
	},

	blue: {
		width: 64,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.RoyalBlue2,
	},

	white: {
		width: 64,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 15,
		lineHeight: 19,
		color: COLOR.White,
	},
	avatar: {
		width: 24,
		height: 24,
		borderRadius: 24,
		backgroundColor: "red",
	},
})
