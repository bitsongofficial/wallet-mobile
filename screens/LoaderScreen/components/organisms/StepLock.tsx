import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TimerCountdown } from "classes"
import { COLOR } from "utils"
import { Title, Caption } from "../atoms"
import { observer } from "mobx-react-lite"

type Props = {
	timer: TimerCountdown
	style?: StyleProp<ViewStyle>
}

export default observer(({ timer, style }: Props) => {
	return (
		<View style={[styles.container, style]}>
			<Image source={require("assets/images/lock.png")} style={styles.icon} />
			<Title style={styles.title}>Wallet app is blocked</Title>
			<Caption style={styles.caption}>Too many PIN attempts</Caption>
			<View style={styles.timerContainer}>
				<Caption style={styles.caption}>Try again in:</Caption>
				<Text style={styles.timer}>{timer.diffSec}</Text>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: { alignItems: "center" },
	icon: {
		marginBottom: 45,
		width: 205,
		height: 205,
	},
	title: {
		marginBottom: 16,
	},
	caption: {
		textAlign: "center",
	},
	timerContainer: {
		marginTop: 50,
		width: 187,
		height: 177,
		backgroundColor: COLOR.Dark2,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},

	timer: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 80,
		lineHeight: 101,
		color: COLOR.White,
	},
})
