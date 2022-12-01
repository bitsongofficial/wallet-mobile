import { useCallback, useMemo } from "react"
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { useLoading, useStore } from "hooks"
import { Icon2, Switch, ThemedGradient } from "components/atoms"
// import { Header } from "./components/atoms";
import { COLOR, InputHandler } from "utils"
import { ListButton, Subtitle } from "./components/atoms"
import { askPin } from "navigation/AskPin"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { withFullHeight } from "screens/layout/hocs"

type Props = NativeStackScreenProps<RootStackParamList, "SettingsSecurity">

export default withFullHeight(observer<Props>(function SettingsSecurityScreen({ navigation }) {
	const { t } = useTranslation()
	const { settings, localStorageManager } = useStore()
	const loading = useLoading()

	const goBack = useCallback(() => navigation.goBack(), [])

	// const toggleEnablePIN = useCallback(
	//   () => settings.setPin({ enable: !settings.pin.enable }),
	//   []
	// );

	const toggleEnableBiometric = useCallback(
		() => settings.setBiometric(!settings.biometric_enable),
		[],
	)
	const toggleDisableScreenshot = useCallback(
		() => settings.setScreenshot(!settings.screenshot),
		[],
	)
	const goToChangePin = useCallback(async () => {
		const pin = await askPin({ isBiometricAllowed: false })
		const newPin = await askPin({ disableVerification: true, isBiometricAllowed: false })
		loading.open()
		await localStorageManager.changePin(newPin, pin)
		loading.close()
	}, [])

	return (
		<>
			<View style={styles.container}>
				<View>
					<Header onPressBack={goBack} style={styles.header} />
					<ScrollView>
						<View style={styles.section}>
							<Subtitle style={styles.subtitle}>{t("PINSettings")}</Subtitle>
							<ListButton icon="password" text={t("ChangePIN")} arrow onPress={goToChangePin} />
						</View>
						<View style={styles.section}>
							<Subtitle style={styles.subtitle}>{t("Account")}</Subtitle>
							<ListButton
								icon="fingerprint_simple"
								text={t("EnableBiometrics")}
								onPress={toggleEnableBiometric}
								Right={
									<Switch gradient active={settings.biometric_enable} onPress={toggleEnableBiometric} />
								}
							/>
						</View>
						{Platform.OS == "android" &&
							<View style={styles.section}>
								<Subtitle style={styles.subtitle}>{t("Miscellaneous")}</Subtitle>
								<ListButton
									icon="eye"
									text={t("DisableScreenshot")}
									onPress={toggleDisableScreenshot}
									Right={
										<Switch gradient active={!settings.screenshot} onPress={toggleDisableScreenshot} />
									} />
							</View>
						}						
					</ScrollView>
				</View>
			</View>
		</>
	)
}))

type PropsHeader = {
	onPressBack(): void
	style?: StyleProp<ViewStyle>
}

const Header = ({ onPressBack, style }: PropsHeader) => (
	<View style={style}>
		<TouchableOpacity
			onPress={onPressBack}
			style={{
				padding: s(5),
				borderRadius: 20,
			}}
		>
			<Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
		</TouchableOpacity>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		marginBottom: vs(25),
	},
	head: {
		marginBottom: vs(30),
	},
	wrapper_opacity: { opacity: 0.1 },
	agreement: { marginBottom: vs(54), marginTop: vs(25) },
	title: { marginBottom: vs(38) },
	section: { marginBottom: vs(35) },
	subtitle: { marginBottom: vs(22) },

	listButton: { marginTop: vs(4) },

	button: { backgroundColor: COLOR.Dark3 },
	buttonContent: { paddingVertical: s(18) },
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
})
