import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useTheme } from "hooks"

type Props = {
	title: string
	subtitle?: string
	Pagination?: JSX.Element
	style?: StyleProp<ViewStyle>
}

export default observer<Props>(function Header({ Pagination, subtitle, title, style }) {
	const theme = useTheme()
	return (
		<View style={[styles.container, style]}>
			<View style={styles.row}>
				<Text style={[styles.title, theme.text.primary]}>{title}</Text>
				{Pagination}
			</View>
			{!!subtitle && <Text style={[styles.caption, theme.text.secondary]}>{subtitle}</Text>}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 21,
		// lineHeight: 27,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 16,
		// lineHeight: 18,

		marginTop: 8,
	},
	left: {},
	right: {},
})
