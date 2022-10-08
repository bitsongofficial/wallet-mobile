import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import { StyledInput, Subtitle, Title } from "../../atoms"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type InputNameStepProps = {
	input: InputHandler
}

export default observer(({ input }: InputNameStepProps) =>
{
	const { t } = useTranslation()

	return (
		<>
			<Title style={styles.title}>{t("NameYourWallet")}</Title>
			<Text style={styles.caption}>
				{t("NameWalletDescription")}
			</Text>
			<StyledInput
				value={input.value}
				onChangeText={input.set}
				placeholder={t("NameWalletPlaceholder")}
				autoFocus
				dark
				isFocus={input.isFocused}
				onFocus={input.focusON}
				onBlur={input.focusOFF}
				style={styles.input}
				keyboardAppearance="dark"
			/>
			<Subtitle style={styles.subtitle}>
				{t("VIP")}
			</Subtitle>
		</>
	)
})

const styles = StyleSheet.create({
	title: {
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",

		marginBottom: vs(30),
	},
	subtitle: {
		fontSize: s(14),
		lineHeight: s(18),
		textAlign: "center",
		opacity: 0.3,
	},

	input: { marginBottom: vs(24) },

	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: vs(26),
	},
})
