import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { RootStackParamList } from "types"
import { COLOR } from "utils"
import { Header, Icon2 } from "components/atoms"
import { Pagination } from "components/moleculs"
import { useFooter, useImportWithKeplr } from "./hooks"
import { useLoading, useStore } from "hooks"
import { StepPinConfirm, StepPinSet } from "./components/templates"

type Props = NativeStackScreenProps<RootStackParamList, "ImportWithKeplr">

export default observer<Props>(({ navigation, route }) => {
	const { wallet, localStorageManager } = useStore()
	const controller = useImportWithKeplr()
	const { steps, confirm, pin } = controller

	const [goBack, goNext] = useFooter(controller.steps)
	const globalLoader = useLoading()

	useEffect(() => {
		// controller.setWallet(route.params.data);
	}, [route.params.data])

	const save = async () => {
		globalLoader.open()
		await localStorageManager.setPin(controller.pin.value)
		await wallet.importFromKeplr("keplr", route.params.data)
		globalLoader.close()
		goNext()
	}

	return (
		<>
			<StatusBar style="light" />
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
				<View style={{ paddingHorizontal: 30, flex: 1 }}>
					{steps.active === 0 && (
						<StepPinSet
							pin={pin}
							isDisableNext={!pin.isValid}
							onPressBack={goBack}
							onPressNext={goNext}
						/>
					)}
					{steps.active === 1 && (
						<StepPinConfirm
							pin={confirm}
							isDisableNext={!(confirm.isValid && pin.isValid && confirm.value === pin.value)}
							onPressBack={goBack}
							onPressNext={save}
						/>
					)}
				</View>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		flexGrow: 1,
	},
	// -------- Main --------
})
