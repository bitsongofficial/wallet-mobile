import { makeAutoObservable } from "mobx"
import { LanguageData, Languages } from "constants/languages"
import { Currencies, CurrenciesData } from "constants/currencies"
import { CheckMethod, NotifSettings } from "./type"
import LocalStorageManager from "./LocalStorageManager"
import { clearPin, savePin } from "utils/biometrics"
import { askPin } from "navigation/AskPin"
import { TimerCountdown } from "classes"
import { changeLanguage } from "i18next"
import { NativeModules } from "react-native"

export default class SettingsStore {
	localStorageManager?: LocalStorageManager

	theme: "light" | "dark" = "dark"
	language: Languages = Languages.En
	currency: Currencies = Currencies.USD
	checkMethod: CheckMethod | null = null
	biometric_enable = false
	testnet = true
	screenshot = true

	notifications: NotifSettings = {
		enable: true,
		history: 10,
	}

	blockingTimer = new TimerCountdown()

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setTheme(theme: "light" | "dark") {
		this.theme = theme
	}

	setLanguage(language: Languages) {
		if(language != this.language)
		{
			changeLanguage(language)
			this.language = language
		}
	}

	get prettyLanguage()
	{
		return LanguageData[this.language]
	}

	setCurrency(currency: Currencies) {
		this.currency = currency
	}

	get prettyCurrency()
	{
		return CurrenciesData[this.currency]
	}

	setNotifications(settings: Partial<NotifSettings>) {
		this.notifications = { ...this.notifications, ...settings }
	}

	setCheckMethod(checkMethod: CheckMethod) {
		this.checkMethod = checkMethod
	}

	setBiometricInternal(biometric_enable: boolean) {
		this.biometric_enable = biometric_enable
	}

	async setBiometric(biometric_enable: boolean, pin?: string)
	{
		if(!this.biometric_enable && biometric_enable)
		{
			const actualPin = pin ?? await askPin()
			if(actualPin !== "")
			{
				await savePin(actualPin)
				this.setBiometricInternal(biometric_enable)
			}
		}
		if(this.biometric_enable && !biometric_enable)
		{
			const res = await clearPin()
			if(res) this.setBiometricInternal(biometric_enable)
		}
	}

	setScreenshotInternal(screenshot: boolean) {
		this.screenshot = screenshot
	}

	setScreenshot(screenshot: boolean)
	{
		if(!this.screenshot && screenshot)
		{
			NativeModules.ScreenshotModule.enableScreenshotAbility()
			this.setScreenshotInternal(screenshot)
		}
		if(this.screenshot && !screenshot)
		{
			NativeModules.ScreenshotModule.disableScreenshotAbility()
			this.setScreenshotInternal(screenshot)
		}
	}

	setTestnet(testnet: boolean)
	{
		this.testnet = testnet
	}

	blockApp(value: Date | number) {
		if (value instanceof Date) {
			this.blockingTimer.setFinish(value)
		} else {
			this.blockingTimer.setFinishTime(value)
		}
		// this.localStorageManager?.saveBlockingEndDate(this.blockingTimer.finish?.toDate())
	}

	get isAppBlock() {
		return this.blockingTimer.isActive
	}
}
