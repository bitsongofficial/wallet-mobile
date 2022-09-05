import { useCallback } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { COLOR } from "utils"
import { Header, Icon2 } from "components/atoms"
import { Pagination } from "components/moleculs"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useFooter, useImportFromSeed } from "./hooks"
import { useLoading, useStore } from "hooks"
import {
	StepImportMnemonic,
	StepNameWallet,
	StepPinConfirm,
	StepPinSet,
} from "./components/templates"

type Props = NativeStackScreenProps<RootStackParamList, "ImportFromSeed">

export default observer<Props>(({ navigation }) => {
	const controller = useImportFromSeed()
	const { steps, phrase, walletName, confirm, pin } = controller
	const { wallet, localStorageManager } = useStore()

	const [goBack, goNext] = useFooter(controller.steps)

	const globalLoader = useLoading()
	const saveWallet = async () => {
		globalLoader.open()
		await localStorageManager.setPin(controller.pin.value)
		await wallet.newCosmosWallet(
			controller.walletName.value,
			controller.phrase.words,
			controller.pin.value,
		)
		globalLoader.close()
		goNext()
	}

	const savePin = useCallback(async () => {
		await localStorageManager.setPin(controller.pin.value)
		goNext()
	}, [])

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
						Left={
							<Pagination
								count={controller.steps.titles.length}
								acitveIndex={controller.steps.active}
							/>
						}
						Center={<Icon2 name="logo" size={56} />}
					/>

					{steps.active === 0 ? (
						<>
							<StepImportMnemonic
								phrase={phrase}
								isDisableNext={false} // TODO: may be need check phrase?
								onPressBack={goBack}
								onPressNext={goNext}
							/>
						</>
					) : (
						<View style={[styles.mh30, { flex: 1 }]}>
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
						</View>
					)}
				</SafeAreaView>
			</KeyboardAvoidingView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		flex: 1,
		borderStartColor: "green",
	},
	keyboardAvoiding: { flex: 1 },
	mh30: { marginHorizontal: 30 },
})
