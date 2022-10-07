import { useCallback, useMemo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FlatList, RectButton, Swipeable } from "react-native-gesture-handler"
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import { observable } from "mobx"
import { observer } from "mobx-react-lite"
import { useStore } from "hooks"
import { COLOR, hexAlpha } from "utils"
import { Button, Icon2 } from "components/atoms"
import { StyledInput, Title } from "../atoms"
import { Phrase as PhraseView } from "components/moleculs"
import * as Clipboard from "expo-clipboard"
import { WalletItemEdited } from "../moleculs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ProfileWallets } from "stores/WalletStore"
import { WalletTypes } from "core/types/storing/Generic"
import { ListButton } from "screens/Profile/components/atoms"
import { ControllerChangeWallet } from "../../controllers"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type Props = {
	close(): void
	controller: ControllerChangeWallet
	onPressViewMnemonic(): void
}

export default observer<Props>(({ close, controller, onPressViewMnemonic }) => {
	const { t } = useTranslation()
	const { wallet } = useStore()
	const { steps, edited, inputSearch, inputWalletName, setEdited, setSelected, seedPhrase } =
		controller

	const filtred = useMemo(() => {
		if (inputSearch.value) {
			const lowerCase = inputSearch.value.toLowerCase()
			return wallet.wallets.filter(({ profile }) => profile.name?.toLowerCase().includes(lowerCase))
		} else {
			return wallet.wallets
		}
	}, [inputSearch.value, wallet.wallets])

	const removeEdited = useCallback(() => setEdited(null), [])

	const onPressDelete = useCallback(() => {
		if (edited) {
			wallet.deleteProfile(edited)
			close()
		}
	}, [edited])

	// ------- FlatList ----------

	const mapItemsRef = useMemo(
		() => observable.map<ProfileWallets, React.RefObject<Swipeable>>(),
		[],
	)

	const keyExtractor = ({ profile }: ProfileWallets) => profile.name
	const renderWallets = useCallback(
		({ item }) => (
			<View style={{ marginBottom: 13 }}>
				<WalletItemEdited
					value={item}
					isActive={controller.selected === item}
					onPress={setSelected}
					onPressDelete={(w) => {
						close()
						wallet.deleteProfile(w)
					}}
					onPressEdit={(profile) => {
						setEdited(profile)
						steps.goTo("Edit Wallet")
					}}
					mapItemsRef={mapItemsRef}
				/>
			</View>
		),
		[controller.selected],
	)

	return (
		<BottomSheetView style={styles.container}>
			{steps.active === 0 && (
				<>
					<View style={styles.wrapper}>
						<View style={styles.header}>
							<View style={styles.headerCenter}>
								<Title style={styles.title}>
									{t("SelectWallet")}
								</Title>
							</View>
						</View>

						<StyledInput
							placeholder={t("SearchWallet")}
							style={styles.search}
							value={inputSearch.value}
							onChangeText={inputSearch.set}
						/>
					</View>

					{/* <View style={[styles.switchContainer, styles.wrapper]}>
                  <Text style={styles.switchTitle}>Tutti</Text>
                  <Switch gradient />
                </View> */}

					<FlatList
						data={filtred}
						keyExtractor={keyExtractor}
						renderItem={renderWallets}
						style={styles.scroll}
						contentContainerStyle={styles.scrollContent}
					/>
				</>
			)}
			{steps.active === 1 && (
				<View style={styles.wrapper}>
					<View style={styles.header}>
						<View style={styles.headerLeft}>
							<RectButton
								style={styles.buttonBack}
								onPress={() => {
									removeEdited()
									steps.goBack()
								}}
							>
								<Icon2 size={24} name="arrow_left" stroke={COLOR.White} />
							</RectButton>
						</View>

						<View style={styles.headerCenter}>
							<Title style={styles.title}>{t("EditWallet")}</Title>
						</View>
						<View style={styles.headerRight} />
					</View>

					<StyledInput
						placeholder={t("NewName")}
						style={styles.search}
						value={inputWalletName.value}
						onChangeText={inputWalletName.set}
					/>

					<View style={styles.editMenu}>
						<Text style={styles.editTitle}>Safety</Text>
						<View style={styles.buttons_list}>
							{edited?.profile.type == WalletTypes.COSMOS && (
								<ListButton
									style={styles.listButton}
									icon="eye"
									text={t("ViewMnemonic")}
									arrow
									onPress={onPressViewMnemonic}
								/>
							)}
							<ListButton
								style={styles.listButton}
								icon="power"
								text={t("DisconnectWallet")}
								arrow
								onPress={onPressDelete}
							/>
						</View>

						<Text style={styles.caption}>
							{t("VIP")}
						</Text>
					</View>
				</View>
			)}

			{steps.active === 2 && (
				<View style={[styles.wrapper, { flex: 1 }]}>
					<View style={styles.header}>
						<View style={styles.headerLeft}>
							<RectButton
								style={styles.buttonBack}
								onPress={() => {
									steps.goBack()
									controller.setPhrase([])
								}}
							>
								<Icon2 size={24} name="arrow_left" stroke={COLOR.White} />
							</RectButton>
						</View>

						<View style={styles.headerCenter}>
							<Title style={styles.title}>{t("ViewMnemonicSeed")}</Title>
						</View>
						<View style={styles.headerRight} />
					</View>

					<BottomSheetScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{ paddingBottom: 116, paddingTop: 10 }}
					>
						<PhraseView style={styles.phrase} hidden={false} value={seedPhrase} />
					</BottomSheetScrollView>
				</View>
			)}
		</BottomSheetView>
	)
})

type FooterProps = {
	onPressSelect(): void
	onPressSave(): void
	controller: ControllerChangeWallet
}

export const Footer = observer<FooterProps>(({ onPressSave, onPressSelect, controller }) => {
	const { t } = useTranslation()
	const insent = useSafeAreaInsets()
	const copyToClipboard = useCallback(
		() => Clipboard.setStringAsync(controller.seedPhrase.join(" ")),
		[],
	)
	return (
		<View style={[styles.buttons, { bottom: insent.bottom }]}>
			{controller.steps.active === 0 && (
				<Button
					text={t("Select")}
					onPress={onPressSelect}
					textStyle={styles.buttonText}
					contentContainerStyle={styles.buttonContent}
				/>
			)}
			{controller.steps.active === 1 && (
				<Button
					disable={controller.inputWalletName.value.length < 4}
					text={t("Save")}
					onPress={onPressSave}
					textStyle={styles.buttonText}
					contentContainerStyle={styles.buttonContent}
				/>
			)}
			{controller.steps.active === 2 && (
				<TouchableOpacity onPress={copyToClipboard}>
					<Text style={[styles.editTitle, { color: COLOR.White }]}>
						{t("CopyToClipboard")}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	)
})

const WRAPPER = s(26)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: vs(15),
	},
	wrapper: { marginHorizontal: WRAPPER },

	// ------ Header ---------
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: vs(30),
	},
	headerRight: { flex: 1 },
	headerCenter: {
		flex: 2,
		alignItems: "center",
	},
	headerLeft: {
		flex: 1,
		flexDirection: "row",
	},

	buttonBack: { padding: s(5) },
	title: { fontSize: s(16) },
	search: { marginBottom: s(9) },

	// ------  Edit --------

	editMenu: { marginTop: vs(40) },
	editTitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),

		color: hexAlpha(COLOR.White, 50),
	},

	buttons_list: {
		marginRight: s(15),
		paddingTop: vs(15),
	},
	listButton: { marginBottom: vs(5) },

	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),

		color: hexAlpha(COLOR.White, 30),
		textAlign: "center",

		marginTop: vs(40),
	},

	// ----- Wallets -------
	switchContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",

		marginTop: vs(32),
		marginBottom: vs(9),
	},
	switchTitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(15),

		color: COLOR.White,
		marginRight: s(11),
	},

	scroll: {
		flexGrow: 1,
	},
	scrollContent: {
		paddingTop: vs(9),
		paddingBottom: vs(70),
	},

	phrase: {
		alignItems: "center",
	},

	// ------- Buttons ------

	buttons: {
		padding: s(15),
		flexDirection: "row",
		justifyContent: "center",
		position: "absolute",
		width: "100%",
	},
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
	buttonContent: {
		paddingVertical: s(18),
		paddingHorizontal: s(40),
	},
})
