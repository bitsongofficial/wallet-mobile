import { useCallback, useEffect, useMemo, useState } from "react"
import { Linking, StyleSheet, View, ViewStyle } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useStore, useTheme } from "hooks"
import { Agreement, Button, Switch, ThemedGradient } from "components/atoms"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { animated, useSpring } from "@react-spring/native"
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated"
import { Header, ListButton, Subtitle, Title, Value, WalletButton } from "./components/atoms"
import { Head } from "./components/moleculs"
import { useDimensions } from "@react-native-community/hooks"
import { useBottomSheetModals } from "./hooks"
import { FAQ_URL, PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from "constants/Links"
import { WalletTypes } from "core/types/storing/Generic"
import { capitalize } from "utils/string"
import { mvs, s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { withFullHeight } from "screens/layout/hocs"

type Props = NativeStackScreenProps<RootStackParamList, "Profile">

export default withFullHeight(observer<Props>(function MainScreen({ navigation }) {
	const { t } = useTranslation()
	const { settings, wallet } = useStore()

	// ------- BottomSheet ----------

	const { screen } = useDimensions()

	const [position, openModal] = useBottomSheetModals()

	const animStyle = useAnimatedStyle(() => {
		const opacity = interpolate(position.value, [0, screen.height], [0, 1], Extrapolation.EXTEND)
		return {
			flex: 1,
			opacity,
		}
	})

	const inputNick = useMemo(
		() => new InputHandler(wallet.activeProfile?.name),
		[wallet.activeProfile?.name],
	)
	const hidden = useSpring({ opacity: inputNick.isFocused ? 0.3 : 1 })

	/// ---------------
	const theme = useTheme()

	const goBack = useCallback(() => navigation.goBack(), [])

	const navToPrivacy = useCallback(() => {}, [])
	const navToTerms = useCallback(() => {}, [])
	const disconnectAndRemove = useCallback(() => {
		if (wallet.activeProfile) wallet.deleteProfile(wallet.activeProfile)
	}, [])

	const openAddWatchaccount = useCallback(() => {}, [])
	const openSecurity = useCallback(() => navigation.navigate("SettingsSecurity"), [])
	const openAddressBook = useCallback(() => navigation.navigate("AddressBook"), [])
	const openNotifications = useCallback(() => navigation.navigate("SettingsNotifications"), [])
	const openWalletConnect = useCallback(() => navigation.navigate("WalletConnect"), [])

	const toggleNightMode = useCallback(() => {
		if (settings.theme == "light") settings.setTheme("dark")
		else settings.setTheme("light")
	}, [])

	const openCurrencyApp = useCallback(() => {}, [])
	const openFAQ = useCallback(() => {
		Linking.openURL(FAQ_URL)
	}, [])
	const openTermsAndConditions = useCallback(() => {
		Linking.openURL(TERMS_AND_CONDITIONS_URL)
	}, [])
	const openPrivacyPolicy = useCallback(() => {
		Linking.openURL(PRIVACY_POLICY_URL)
	}, [])

	const toggleNotification = useCallback(
		() => settings.setNotifications({ enable: !settings.notifications.enable }),
		[],
	)

	const onChangeNick = useCallback(() => {
		if (!wallet.profileExists(inputNick.value)) {
			wallet.changeActiveProfileName(inputNick.value)
		}
	}, [inputNick.value])

	const translationY = useSharedValue(0)
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (e) => (translationY.value = e.contentOffset.y),
	})

	const headerContainerAnimatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(translationY.value, [0, 64], [0, -64], Extrapolation.CLAMP)
		return { transform: [{ translateY }] }
	})

	return (
		<>
			<StatusBar style="inverted" />

			<View style={styles.container}>
				<Animated.View style={[styles.animContainer, animStyle]}>
					<Header onPressClose={goBack} style={styles.header} animtedValue={translationY} />
					<View style={[styles.containerHead]}>
						<Head
							style={styles.head}
							input={inputNick}
							onPressAvatar={openModal.changeAvatar}
							onNickEdited={onChangeNick}
							avatar={wallet.activeProfile?.avatar}
							animtedValue={translationY}
						/>
					</View>
					<Animated.ScrollView
						onScroll={scrollHandler}
						contentContainerStyle={styles.scrollContent}
						scrollEventThrottle={1}
					>
						<animated.View style={[styles.wrapper, hidden]}>
							<Subtitle style={styles.subtitle}>
								{t("ConnectedWith")}
							</Subtitle>
							<WalletButton
								onPress={openModal.changeWallet}
								wallet={wallet.activeWallet}
								style={styles.activeWallet}
							/>

							<ListButton
								text={t("AddNewAccount")}
								onPress={openModal.addAccount}
								icon="wallet"
								arrow
								style={styles.listButton}
							/>
							<ListButton
								text={t("AddWatchAccount")}
								onPress={openModal.addWatchAccount}
								icon="eye"
								arrow
							/>

							<Agreement
								onPressPrivacy={navToPrivacy}
								onPressTerms={navToTerms}
								style={styles.agreement}
							/>

							<View>
								<Title style={styles.title}>{t("SettingsTitle")}</Title>

								<View style={styles.section}>
									<Subtitle style={styles.subtitle}>{t("AccountSection")}</Subtitle>
									<ListButton
										onPress={openSecurity}
										icon="star_shield"
										text={t("Security")}
										arrow
										style={styles.listButton}
									/>
									<ListButton
										disabled={wallet.activeProfile?.type == WalletTypes.WATCH}
										text={t("WalletConnect")}
										icon="wallet_connect"
										onPress={openWalletConnect}
										style={styles.listButton}
										arrow
									/>
								</View>
								<View style={styles.section}>
									<Subtitle style={styles.subtitle}>{t("PreferencesSection")}</Subtitle>
									<ListButton
										text={t("Language")}
										onPress={openModal.changeLanguage}
										icon="translate"
										style={styles.listButton}
										Right={<Value text={capitalize(settings.prettyLanguage.name)} />}
									/>
									<ListButton
										text={t("Currency")}
										onPress={openModal.channgeCurrency}
										icon="circle_dollar"
										style={styles.listButton}
										Right={
											settings.currency != null && (
												<Value text={settings.currency.toUpperCase()} />
											)
										}
									/>
									<ListButton
										text={t("NightMode")}
										onPress={toggleNightMode}
										icon="moon"
										style={styles.listButton}
										disabled={true}
										Right={
											<Switch
												active={settings.theme == "dark"}
												onPress={toggleNightMode}
												disabled={true}
												gradient={true}
											/>
										}
									/>
								</View>

								<View style={styles.section}>
									<Subtitle style={styles.subtitle}>{t("SupportSection")}</Subtitle>
									<ListButton
										text={t("CurrencyApp")}
										onPress={openCurrencyApp}
										icon="star"
										arrow
										style={styles.listButton}
										disabled={true}
									/>
									<ListButton
										text={t("FAQ")}
										onPress={openFAQ}
										icon="chat_dots"
										arrow
										style={styles.listButton}
									/>
									<ListButton
										text={t("TermsAndConditions")}
										onPress={openTermsAndConditions}
										icon="file_text"
										arrow
										style={styles.listButton}
									/>
									<ListButton
										text={t("PrivacyPolicy")}
										onPress={openPrivacyPolicy}
										icon="file_text"
										style={styles.listButton}
										arrow
									/>
								</View>

								<Button
									mode="fill"
									text={t("DisconnectAndRemoveWallet")}
									textAlignment="center"
									onPress={disconnectAndRemove}
									style={styles.button}
									textStyle={styles.buttonText}
									contentContainerStyle={styles.buttonContent}
								/>
							</View>
						</animated.View>
					</Animated.ScrollView>
				</Animated.View>
			</View>
		</>
	)
}))

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
		position: "relative"
	},
	animContainer: { opacity: 1 },
	header: {
		zIndex: 5,
		position: "absolute",
		width: "100%",
	},

	containerHead: {
		zIndex: 1,
		width: "100%",
		paddingVertical: s(7),
	},
	head: {
		marginBottom: vs(30),
	},

	activeWallet: { marginBottom: mvs(16) },
	scrollContent: {  },

	wrapper: { },
	wrapper_opacity: { opacity: 0.1 },
	agreement: { marginBottom: vs(54), marginTop: vs(25) },
	title: { marginBottom: s(38) },
	section: { marginBottom: s(35) },
	subtitle: { marginBottom: s(22) },

	listButton: { marginTop: s(4) },

	button: { backgroundColor: hexAlpha(COLOR.White, 10), marginBottom: s(8) },
	buttonContent: { paddingVertical: s(18) },
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
})
