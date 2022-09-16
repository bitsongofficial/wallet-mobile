import { useCallback, useMemo } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
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

type Props = NativeStackScreenProps<RootStackParamList, "SettingsSecurity">

export default observer<Props>(function SettingsSecurityScreen({ navigation }) {
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
	const goToChangePin = useCallback(async () => {
		const pin = await askPin({ isBiometricAllowed: false })
		const newPin = await askPin({ disableVerification: true, isBiometricAllowed: false })
		loading.open()
		await localStorageManager.changePin(newPin, pin)
		loading.close()
	}, [])

	return (
		<>
			<StatusBar style="light" />

			<ThemedGradient style={styles.container} invert>
				<SafeAreaView style={styles.container}>
					<View style={styles.wrapper}>
						<Header onPressBack={goBack} style={styles.header} />
						<ScrollView>
							<View style={styles.section}>
								<Subtitle style={styles.subtitle}>PIN settings</Subtitle>
								{/* <ListButton
                  icon="lock_key_open"
                  text="Enable PIN code"
                  onPress={toggleEnablePIN}
                  Right={
                    <Switch
                      active={settings.pin.enable}
                      onPress={toggleEnablePIN}
                    />
                  }
                  // Right={}
                /> */}
								<ListButton icon="password" text="Change PIN" arrow onPress={goToChangePin} />
							</View>

							{/* <View style={styles.section}>
                <Subtitle style={styles.subtitle}>Account</Subtitle>
                <ListButton icon="key" text="View Mnemonic" arrow />
              </View> */}

							<View style={styles.section}>
								<Subtitle style={styles.subtitle}>Account</Subtitle>
								<ListButton
									icon="fingerprint_simple"
									text="Enable Biometrics"
									onPress={toggleEnableBiometric}
									Right={
										<Switch active={settings.biometric_enable} onPress={toggleEnableBiometric} />
									}
								/>
							</View>
						</ScrollView>
					</View>
				</SafeAreaView>
			</ThemedGradient>
		</>
	)
})

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
	container: { flex: 1 },
	header: {
		marginBottom: vs(25),
	},

	head: {
		marginHorizontal: s(25), // <- wrapper
		marginBottom: vs(30),
	},

	wrapper: { marginHorizontal: s(34) },
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
