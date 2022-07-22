import { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Validator } from "classes/types"

type ValidatorProps = {
	item: Validator
	onPressKebab(item: Validator): void
}

export default ({ item, onPressKebab }: ValidatorProps) => {
	const handlePressKebab = useCallback(() => onPressKebab(item), [item])

	return (
		<View style={styles.container}>
			<View style={[styles.row, { marginBottom: 14 }]}>
				<View style={styles.info}>
					{/* <Image source={{ uri: item.logo }} /> */}
					<View style={styles.avatar} />
					<Text style={styles.title}>Forbole</Text>
				</View>
				<RectButton onPress={handlePressKebab}>
					<Icon2 name="kebab" stroke={COLOR.Marengo} size={24} />
				</RectButton>
			</View>
			<View style={styles.footer}>
				<View style={styles.left}>
					<Text style={styles.percent}>33.83%</Text>
					<Text style={styles.text}>APR</Text>
				</View>
				<View style={styles.right}>
					<Text style={styles.percent}>10.64%</Text>
					<Text style={styles.text}>VOTING POWER</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 160,
		borderRadius: 20,
		backgroundColor: COLOR.Dark2,
		padding: 24,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},

	info: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	percent: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 24,
		lineHeight: 30,

		color: COLOR.White,
	},

	footer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},

	left: {
		justifyContent: "space-between",
	},
	right: {
		alignItems: "flex-end",
		justifyContent: "space-between",
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.Marengo,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 23,

		color: COLOR.White,
	},

	avatar: {
		width: 42,
		height: 42,
		borderRadius: 42,
		backgroundColor: "red",

		marginRight: 16,
	},
})
