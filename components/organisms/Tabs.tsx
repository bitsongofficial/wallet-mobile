import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import ThemedGradient from "components/atoms/ThemedGradient"
import { COLOR } from "utils"

type Props<T extends string> = {
	values: T[]
	active: T
	onPress(value: T): void
	style?: StyleProp<ViewStyle>
}

export default function Tabs<T extends string>({ active, values, style, onPress }: Props<T>) {
	return (
		<View style={[styles.container, style]}>
			{values.map((value, i) => (
				<TouchableOpacity key={value + i} onPress={() => onPress(value)}>
					<View style={styles.tab}>
						<Text style={[styles.tab_value, value !== active && styles.tab_not_active]}>
							{value}
						</Text>
						{value === active && <ThemedGradient style={styles.marker} />}
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flexDirection: "row" },
	marker: {
		borderRadius: 4,
		height: 9,
		marginTop: 5,
	},

	tab: { marginRight: 30 },
	tab_value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,

		color: COLOR.White,
	},
	tab_not_active: {
		color: COLOR.Marengo,
		fontWeight: "400",
	},
})
