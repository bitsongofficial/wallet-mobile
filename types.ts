/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabHeaderProps, BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackHeaderProps, NativeStackScreenProps } from "@react-navigation/native-stack"
import TransactionCreater from "classes/Transaction/Creater"
import { SupportedCoins } from "constants/Coins"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { Validator } from "core/types/coin/cosmos/Validator"

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

type LoaderParams<T extends any = any, A extends any[] = any[], F = (...args: A) => Promise<T>> = {
	callback: F
	onSucceess?(result: T): void
	onError?(error: unknown): void
	header?: (props: NativeStackHeaderProps | BottomTabHeaderProps) => React.ReactNode
}

// PinRequest: {resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void}
export type RootStackParamList = {
	// Before  Auth
	Splash: undefined
	Start: undefined
	CreateWallet: undefined
	ImportFromSeed: undefined
	ImportWithKeplr: { data: string }

	// Common
	ScannerQR: {
		onBarCodeScanned(data: string): void
		onClose?(): void
	}

	// After Auth
	Root: NavigatorScreenParams<RootTabParamList> | undefined
	SendDetailsFull: undefined

	Profile: undefined
	SettingsSecurity: undefined
	SettingsNotifications: undefined
	WalletConnect: NavigatorScreenParams<RootTabParamList> | undefined

	Loader: LoaderParams | undefined
	PinRequest: {
		callback(pin?: string): void

		errorMax?: number
		titleTranslationString?: string
		isRandomKeyboard?: boolean
		isHiddenCode?: boolean
		disableVerification?: boolean
		isBiometricAllowed?: boolean
	}
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
	RootStackParamList,
	Screen
>

export type RootTabParamList = {
	MainTab: undefined
	ValidatorsList: undefined
	Proposal: undefined
	Tab2: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
	BottomTabScreenProps<RootTabParamList, Screen>,
	NativeStackScreenProps<RootStackParamList>
>
