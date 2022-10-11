import { useCallback, useRef } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useStore, useTheme } from "hooks"
import { SafeAreaView } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "types"
import { Button, ButtonChevroletRight, Header, InlineButton, Title } from "components/atoms"
import Icon2 from "components/atoms/Icon2"
import { BottomSheetModal } from "components/moleculs"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { useFocusEffect } from "@react-navigation/native"
// @ts-ignore
import waves_light from "assets/images/waves_light.png"
import { COLOR } from "utils"
import { s, vs } from "react-native-size-matters"
import { withStatusBarFullHeight } from "./layout/hocs"

type Props = NativeStackScreenProps<RootStackParamList, "Start">

const points = [s(270)]

export default withStatusBarFullHeight(observer<Props>(function StartScreen({ navigation }) {
	const theme = useTheme()
	const { wallet } = useStore()

	// --------- Bottosheet ----------

	const bottomSheet = useRef<BottomSheetModalMethods>(null)
	useFocusEffect(useCallback(() => () => bottomSheet.current?.close(), [])) // TODO: remove bottomsheet modal and useFocus effect

	const openBottomSheet = useCallback(() => bottomSheet.current?.present(), [])

	// ---------- Navigation -----------
	const createCreateWallet = useCallback(() => navigation.navigate("CreateWallet"), [])
	const importFromSeed = useCallback(() => navigation.navigate("ImportFromSeed"), [])
	const importWithKeplr = useCallback(
		() =>
			navigation.navigate("ScannerQR", {
				onBarCodeScanned: (data) => navigation.navigate("ImportWithKeplr", { data }),
			}),
		[],
	)
	const test = useCallback(() => navigation.reset({ index: 0, routes: [{ name: "Root" }] }), [])

	return (
		<>
			<SafeAreaView style={styles.container}>
				<Header
					Center={
						<>
							<Icon2 name="logo" size={s(56)} />
						</>
					}
				/>
				<View style={styles.bottom}>
					<Title titleStyle={[styles.text, theme.text.primary]}>
						A nice phrase to {"\n"} welcome our users.
					</Title>

					<View style={styles.buttons}>
						<ButtonChevroletRight
							text="Create Wallet"
							onPress={createCreateWallet}
							style={styles.mb18}
						/>
						<ButtonChevroletRight
							text="Import Existing Wallet"
							mode="gradient_border"
							onPress={openBottomSheet}
							style={styles.mb24}
						/>
						<InlineButton
							onPress={test}
							Right={<Icon2 name="chevron_right_2" stroke={COLOR.White} size={18} />}
							style={styles.buttonContent}
						>
							<Text style={theme.text.colorText}>Import with</Text> Ledger Nano X
						</InlineButton>
						{wallet.activeWallet && (
							<Button
								mode="fill"
								onPress={test}
								contentContainerStyle={styles.buttonContent}
								Right={<Icon2 name="chevron_right_2" size={18} />}
							>
								<Text style={[styles.buttonText, theme.text.colorText]}>Skip</Text>
							</Button>
						)}
					</View>
				</View>
			</SafeAreaView>

			<BottomSheetModal ref={bottomSheet} index={0} snapPoints={points}>
				<View style={styles.bottomSheetContainer}>
					<Title size={16} style={styles.bottomSheetTitle}>Import Existing Wallet</Title>
					<ButtonChevroletRight
						text="Import from Seed Phrase"
						onPress={importFromSeed}
						style={styles.mb12}
					/>
					<ButtonChevroletRight
						mode="gradient_border"
						text="Import with Keplr Extension"
						onPress={importWithKeplr}
						contentContainerStyle={{ backgroundColor: theme.bottomsheet.background.backgroundColor }}
						style={styles.mb12}
					/>
				</View>
			</BottomSheetModal>
		</>
	)
}))

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-end",
	},
	buttons: {
		marginTop: vs(50),
		justifyContent: "flex-end",
	},

	bottom: {
		justifyContent: "flex-end",
		flex: 1,
	},
	mb12: { marginBottom: vs(12) },
	mb18: { marginBottom: vs(18) },
	mb24: { marginBottom: vs(24) },

	buttonContent: {
		paddingVertical: s(18),
		paddingHorizontal: s(24),
	},
	buttonContent_gradient: {
		paddingVertical: s(16),
		justifyContent: "space-between",
	},

	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: s(24),
		lineHeight: s(30),
	},

	bottomSheetTitle: {
		marginBottom: 32,
	},
	bottomSheetContainer: {
		paddingHorizontal: 30,
		paddingVertical: 20,
	},
})
