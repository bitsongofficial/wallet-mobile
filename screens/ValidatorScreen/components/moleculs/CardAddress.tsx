import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Caption, Card } from "../atoms"
import { memo } from "react"
import { RectButton } from "react-native-gesture-handler"

type Props = {
	style: StyleProp<ViewStyle>
	value: string
	title: string
	onPress(value: string): void
}

export default memo(({ style, title, value, onPress }: Props) => {
	const short = `${value.substring(0, 10)}..${value.slice(-11)}`

	return (
		<RectButton style={style} onPress={() => onPress(value)}>
			<Card style={styles.container}>
				<Caption style={styles.caption}>{title}</Caption>
				<View style={styles.address}>
					<Text style={styles.text}>{short}</Text>
					<Icon2 stroke={COLOR.PearlBlackberry} name="copy" />
				</View>
			</Card>
		</RectButton>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingLeft: 21,
		paddingRight: 25,
		paddingVertical: 24,
	},
	caption: {
		marginBottom: 19,
	},
	address: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
	},
})
