import { useEffect, useState } from "react"
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { s, vs } from "react-native-size-matters"
import { TimerCountdown } from "classes"
import { COLOR } from "utils"
import { Title, Caption } from "../atoms"
import { useTranslation } from "react-i18next"

type Props = {
	timer: TimerCountdown
	style?: StyleProp<ViewStyle>
}

export default observer(({ timer, style }: Props) => {
	const { t } = useTranslation()
	const [showNumber, setShowNumber] = useState(false)

	useEffect(() => {
		if (timer.diffSec) setShowNumber(true)
	}, [timer.isActive])

	return (
		<View style={[styles.container, style]}>
			<Image source={require("assets/images/error.png")} style={styles.icon} />
			<Title style={styles.title}>{t("AppBlocked")}</Title>
			<Caption style={styles.caption}>{t("TooManyPinAttempts")}</Caption>
			<View style={styles.timerContainer}>
				<Caption style={styles.caption}>{t("TryAgainIn")}:</Caption>
				{showNumber && <Text style={styles.timer}>{timer.diffSec}</Text>}
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: { alignItems: "center" },
	icon: {
		marginBottom: vs(25),
		width: vs(110),
		height: vs(110),
	},
	title: { marginBottom: vs(8) },
	caption: { textAlign: "center" },
	timerContainer: {
		marginTop: vs(25),
		width: vs(187),
		height: vs(177),
		backgroundColor: COLOR.Dark2,
		borderRadius: s(20),
		alignItems: "center",
		justifyContent: "center",
	},
	timer: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: vs(80),
		lineHeight: vs(101),
		color: COLOR.White,
	},
})
