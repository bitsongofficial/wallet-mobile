import { PureComponent } from "react"
import { StyleProp, StyleSheet, Text, TextProps, View, ViewProps, ViewStyle } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"

export default class Recap extends PureComponent<ViewProps> {
	static Title = ({ children }: TextProps) => <Text style={styles.title}>{children}</Text>
	static Amount = ({ children }: TextProps) => <Text style={styles.amount}>{children}</Text>
	static Stats = ({ children }: ViewProps) => (
		<View style={styles.stats}>
			<View style={styles.flex1}>{children}</View>
		</View>
	)

	static Stat = ({
		name,
		value,
		style,
		nameStyle,
	}: {
		name: string
		value?: string | JSX.Element | boolean
		style?: StyleProp<ViewStyle>
		nameStyle?: StyleProp<ViewStyle>
	}) => {
		return (
			<View style={[styles.statContainer, style]}>
				<Text style={[styles.name, nameStyle]}>{name}</Text>
				{!!value && (typeof value === "string" ? <Text style={styles.value}>{value}</Text> : value)}
			</View>
		)
	}

	static Value = ({ value, logo }: { value: string; logo: string }) => {
		return (
			<View style={styles.valueContainer}>
				<Text style={styles.value}>{value}</Text>
				{/* <Image style={styles.avatar} source={{ uri: logo }} /> */}
				<View style={styles.avatar} />
			</View>
		)
	}

	render() {
		return <View {...this.props} style={[styles.container, this.props.style]} />
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingVertical: s(32),
		paddingHorizontal: s(20),
		borderRadius: s(20),
		marginTop: s(36),
	},

	stats: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	flex1: { flex: 1 },
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.RoyalBlue2,

		marginBottom: vs(12),
	},
	amount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(42),
		lineHeight: s(53),
		color: COLOR.White,

		marginBottom: vs(8),
	},

	statContainer: {
		flexDirection: "row",
	},
	name: {
		width: s(74),
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.RoyalBlue2,
	},

	valueContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},

	value: {
		width: s(64),
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(15),
		lineHeight: s(19),
		color: COLOR.White,
	},
	avatar: {
		width: s(24),
		height: s(24),
		borderRadius: s(24),
		backgroundColor: COLOR.Dark1,
	},
})
