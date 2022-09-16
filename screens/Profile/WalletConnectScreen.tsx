import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FlatList, RectButton, Swipeable, TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { useStore } from "hooks"
import { Button, Icon2, ThemedGradient } from "components/atoms"
// import { Header } from "./components/atoms";
import { COLOR } from "utils"
import { Circles, Subtitle, Title } from "./components/atoms"
import { observable } from "mobx"
import { WalletItem } from "./components/moleculs"
import { ProfileWallets } from "stores/WalletStore"
import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1"
import SwipeableItem from "components/organisms/SwipeableItem"
import { s, vs } from "react-native-size-matters"
import moment from "moment"

type Props = NativeStackScreenProps<RootStackParamList, "WalletConnect">

const WRAPPER = s(34)

export default observer<Props>(function WalletConnect({ navigation }) {
	const { dapp } = useStore()

	// ------- Wallets ------
	const connections = dapp.connections
	const mapItemsRef = useMemo(() => observable.map<string, React.RefObject<Swipeable>>(), [])

	const renderWallet = useCallback<ListRenderItem<WalletConnectCosmosClientV1>>(
		({ item, index }) =>
			item && item.connector ? (
				<View key={item.connector.session.key} style={{ marginBottom: 13 }}>
					<SwipeableItem
						wrapper={WRAPPER}
						id={item.connector.session.key}
						date={item.date ? moment(item.date).format("MMM D, LT") : ""}
						mapItemsRef={mapItemsRef}
						onPressDelete={() => dapp.disconnect(item)}
						name={item.name ?? "Unknown"}
						onPress={() => {}}
					/>
				</View>
			) : null,
		[],
	)

	const navToScanner = useCallback(
		() =>
			navigation.navigate("ScannerQR", {
				onBarCodeScanned(data) {
					dapp.connect(data)
				},
			}),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [])

	const insets = useSafeAreaInsets()

	return (
		<>
			<StatusBar style="light" />

			<ThemedGradient invert style={styles.container}>
				<View style={[styles.safeArea, { paddingTop: insets.top }]}>
					<Header
						onPressBack={goBack}
						style={styles.header}
						title="Wallet Connect"
						onPressScan={navToScanner}
					/>
					{connections.length > 0 && (
						<>
							<Subtitle style={styles.caption}>Connessioni attive</Subtitle>
							<FlatList
								bounces={false}
								styles={styles.flatlist}
								contentContainerStyle={styles.flatlistContent}
								data={connections}
								renderItem={renderWallet}
							/>
						</>
					)}
					<View style={[styles.wrapper, { flex: 1 }]}>
						{connections.length === 0 && (
							<>
								<Circles>
									<Icon2 name="qr_code" size={70} stroke={COLOR.White} />
								</Circles>
								<View style={{ flex: 1 }}>
									<Title style={styles.title}>Non hai ancora aggiunto alcun contatto</Title>
									<Subtitle style={styles.subtitle}>
										Access VIP experiences, exclusive previews, finance your own music projects and
										have your say.
									</Subtitle>
								</View>
							</>
						)}
						<View style={styles.buttonContainer}>
							<Button
								onPress={navToScanner}
								textStyle={styles.buttonText}
								contentContainerStyle={styles.buttonContent}
								mode="fill"
								text="Scan QR Code"
							/>
						</View>
					</View>
				</View>
			</ThemedGradient>
		</>
	)
})

type PropsHeader = {
	onPressBack(): void
	onPressScan(): void
	style?: StyleProp<ViewStyle>
	title?: string
}

const Header = ({ onPressBack, style, title, onPressScan }: PropsHeader) => (
	<View style={[styles.header_container, style]}>
		<View style={styles.header_left}>
			<TouchableOpacity onPress={onPressBack} style={styles.header_backButton}>
				<Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
			</TouchableOpacity>
			<Title style={{ marginLeft: 19, fontSize: s(18) }}>{title}</Title>
		</View>
		<View style={styles.header_right}>
			<View style={styles.header_scanButtonContainer}>
				<RectButton style={styles.header_scanButton} onPress={onPressScan}>
					<Icon2 name="scan_2" size={20} stroke={COLOR.White} />
				</RectButton>
			</View>
		</View>
	</View>
)

const styles = StyleSheet.create({
	container: { flex: 1 },
	safeArea: { flex: 1 },
	header: {
		marginBottom: s(25),
		paddingVertical: s(10),
		paddingHorizontal: s(20),
	},

	head: {
		marginHorizontal: s(25), // <- wrapper
		marginBottom: vs(30),
	},

	wrapper: { marginHorizontal: WRAPPER },
	caption: {
		marginHorizontal: WRAPPER,
	},
	flatlist: {
		marginTop: vs(10),
	},
	flatlistContent: {
		paddingBottom: s(70),
		paddingTop: s(30),
	},
	title: {
		fontSize: s(18),
		lineHeight: s(24),
		textAlign: "center",
		marginBottom: vs(25),
	},
	subtitle: {
		fontSize: s(15),
		lineHeight: s(18),
		textAlign: "center",
		opacity: 0.3,
	},

	button: {},
	buttonContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		alignItems: "center",
		paddingVertical: s(16),
	},
	buttonContent: {
		paddingHorizontal: s(55),
		paddingVertical: s(18),
		backgroundColor: COLOR.Dark3,
	},
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},

	// ------- Header ----------
	header_container: { flexDirection: "row" },
	header_left: { flexDirection: "row" },
	header_backButton: {
		padding: s(5),
		borderRadius: s(20),
	},
	header_right: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	header_scanButtonContainer: {
		width: s(33),
		height: s(33),
		borderRadius: s(33),
		backgroundColor: COLOR.Dark3,
		overflow: "hidden",
	},
	header_scanButton: {
		width: s(33),
		height: s(33),
		alignItems: "center",
		justifyContent: "center",
	},
})
