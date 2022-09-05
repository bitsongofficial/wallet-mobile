import { useCallback, useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { supportedAuthenticationTypesAsync, AuthenticationType } from "expo-local-authentication"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { CheckMethod } from "stores/type"
import { COLOR } from "utils"
import { useLoading, useStore } from "hooks"
import { Pagination } from "components/moleculs"
import { Header, Icon2 } from "components/atoms"
import { useCreateWallet, useFooter } from "./hooks"
import {
	StepCreateMnemonic,
	StepNameWallet,
	StepPinConfirm,
	StepPinSet,
} from "./components/templates"
import { FaceID } from "./components/organisms"

type Props = NativeStackScreenProps<RootStackParamList, "CreateWallet">

export default observer<Props>(({ navigation }) => {
	const controller = useCreateWallet()

	const { wallet, settings, localStorageManager } = useStore()
	const { steps, phrase, walletName, confirm, pin } = controller

	const [authTypes, setAuthenticationTypes] = useState<AuthenticationType[]>()

	useEffect(() => {
		supportedAuthenticationTypesAsync().then(setAuthenticationTypes)
	}, [])

	useEffect(() => {
		controller.setPhraseShown(false)
		controller.phrase.create()
	}, [])

	const [goBack, goNext] = useFooter(controller.steps)
	const savePin = useCallback(async () => {
		await localStorageManager.setPin(controller.pin.value)
		goNext()
	}, [])

	const globalLoader = useLoading()
	const saveWallet = useCallback(async () => {
		globalLoader.open()
		await wallet.newCosmosWallet(
			controller.walletName.value,
			controller.phrase.words,
			controller.pin.value,
		)
		globalLoader.close()
		goNext()
	}, [])

	const setCheckMethod = useCallback(
		(method: CheckMethod) => {
			settings.setCheckMethod(method)
			goNext()
		},
		[goNext],
	)

	const insets = useSafeAreaInsets()

	return (
		<>
			<StatusBar style="light" />
			<KeyboardAvoidingView
				style={styles.keyboardAvoiding}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={-insets.bottom}
			>
				<SafeAreaView style={styles.container}>
					<Header
						Left={<Pagination count={steps.titles.length} acitveIndex={steps.active} />}
						Center={<Icon2 name="logo" size={56} />}
					/>
					{steps.active === 0 && (
						<StepCreateMnemonic
							phrase={phrase}
							onPressToggle={() => controller.setPhraseShown(!controller.isPhraseShown)}
							isHidden={!controller.isPhraseShown}
							onPressBack={goBack}
							onPressNext={goNext}
						/>
					)}
					{steps.active === 1 && (
						<StepNameWallet
							input={walletName}
							isDisableNext={walletName.value.length < 3}
							onPressBack={goBack}
							onPressNext={goNext}
						/>
					)}
					{steps.active === 2 && (
						<StepPinSet
							pin={pin}
							isDisableNext={!pin.isValid}
							onPressBack={goBack}
							onPressNext={savePin}
						/>
					)}
					{steps.active === 3 && (
						<StepPinConfirm
							pin={confirm}
							isDisableNext={!(confirm.isValid && pin.isValid && confirm.value === pin.value)}
							onPressBack={goBack}
							onPressNext={saveWallet}
						/>
					)}

					{steps.active === 4 && authTypes && (
						<FaceID authTypes={authTypes} onDone={setCheckMethod} pin={controller.pin.value} />
					)}
				</SafeAreaView>
			</KeyboardAvoidingView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingHorizontal: 30,
		flexGrow: 1,
	},
	keyboardAvoiding: { flexGrow: 1 },
})
