import { useMemo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { Pin } from "classes"
import { COLOR } from "utils"
import { useTheme } from "hooks"
import { s } from "react-native-size-matters"

type Props = {
	value?: Pin["value"]
	style?: StyleProp<ViewStyle>
	isHidden?: boolean
	isError?: boolean
	isConfirm?: boolean
}

export default ({ value = "", style, isHidden, isError, isConfirm }: Props) => {
	const theme = useTheme()
	const nums = useMemo(
		() => [...value.split(""), ...new Array(Pin.max - value.length).fill(null)],
		[value],
	)

	return (
		<View style={[styles.container, style]}>
			{nums.map((num, index) => (
				<View key={index} style={styles.item}>
					{num ? (
						isHidden ? (
							<View
								style={[
									styles.placeholder,
									styles.placeholder_fill,
									isError && { backgroundColor: COLOR.Pink },
									isConfirm && { backgroundColor: COLOR.GreenCrayola },
								]}
							/>
						) : (
							<Text style={[styles.num, theme.text.primary, isError && { color: COLOR.Pink }, isConfirm && { color: COLOR.GreenCrayola }]}>
								{num}
							</Text>
						)
					) : (
						<View style={styles.placeholder} />
					)}
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	item: {
		width: s(30),
		height: s(60),
		alignItems: "center",
		justifyContent: "center",
	},
	num: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(40),
	},
	placeholder: {
		width: s(6),
		height: s(10),
		borderRadius: s(50),
		backgroundColor: COLOR.White,
		opacity: 0.15,
	},

	placeholder_fill: {
		opacity: 1,
	},
})
