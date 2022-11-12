import { Icon2 } from "components/atoms"
import { useTranslation } from "react-i18next"
import { Image, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { Caption, Title, Button } from "../atoms"

type Props = {
	onPressBack(): void
}

export default ({ onPressBack }: Props) =>
{
	const { t } = useTranslation()

	return (
		<>
			<View style={styles.iconContainer}>
				<Image source={require("assets/images/error.png")} style={styles.icon} />
			</View>
	
			<View>
				<Title style={styles.title}>{t("TransactionError")}</Title>
				<Caption style={styles.caption}>
					{t("TransactionErrorDescription")}
				</Caption>
			</View>
	
			<View style={styles.buttonContainer}>
				<Button
					text={t("BackToHome")}
					mode="fill"
					onPress={onPressBack}
					Right={<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />}
				/>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		marginBottom: vs(24),
	},
	caption: {
		textAlign: "center",
	},
	iconContainer: {
		height: 218,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		width: "100%",
	},

	icon: {
		width: s(110),
		height: s(110),
	},
})
