import { PureComponent } from "react"
import { StyleProp, StyleSheet, Text, TextProps, View, ViewProps, ViewStyle } from "react-native"
import { COLOR } from "utils"

export default class Recap extends PureComponent {
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
	}: {
		name: string
		value?: string | JSX.Element | boolean
		style?: StyleProp<ViewStyle>
	}) => {
		return (
			<View style={[styles.statContainer, style]}>
				<Text style={styles.name}>{name}</Text>
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
		return <View style={styles.container}>{this.props.children}</View>
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingVertical: 32,
		paddingHorizontal: 20,
		borderRadius: 20,
		marginTop: 36,
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

	statContainer: {
		flexDirection: "row",
	},
	name: {
		width: 74,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.RoyalBlue2,
	},

	valueContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},

	value: {
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
