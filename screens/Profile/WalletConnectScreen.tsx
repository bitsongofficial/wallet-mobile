import { useCallback, useEffect, useMemo } from "react"
import { ListRenderItem, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { FlatList, RectButton, Swipeable, TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { RootStackParamList } from "types"
import { useStore } from "hooks"
import { Button, Icon2, ThemedGradient } from "components/atoms"
// import { Header } from "./components/atoms";
import { COLOR } from "utils"
import { Circles, Subtitle, Title } from "./components/atoms"
import { observable, toJS } from "mobx"
import SwipeableItem from "components/organisms/SwipeableItem"
import { s, vs } from "react-native-size-matters"
import moment from "moment"
import { withFullHeight } from "screens/layout/hocs"
import { t } from "i18next"
import { DappConnection } from "stores/DappConnectionStore"
import { WalletConnectBaseEvents, WalletConnectConnectorV1 } from "core/connection/WalletConnect/ConnectorV1"
import { openWalletConnectScan } from "modals/walletconnect/openWalletConnectScan"

type Props = NativeStackScreenProps<RootStackParamList, "WalletConnect">

const WRAPPER = s(34)

type ConnectionsListData = {
	name: string,
	date: Date | null,
	connector: WalletConnectConnectorV1<WalletConnectBaseEvents>,
}

export default withFullHeight(observer<Props>(function WalletConnect({ navigation }) {
	const { dapp } = useStore()

	// ------- Wallets ------
	const connectors: ConnectionsListData[] = toJS(dapp.connections).map(c => ({name: c.connector.meta.name, date: c.connector.meta.date, connector: c.connector}))
	const mapItemsRef = useMemo(() => observable.map<string, React.RefObject<Swipeable>>(), [])

	const renderWallet = useCallback<ListRenderItem<ConnectionsListData>>(
		({ item, index }) =>
			item && item.connector ? (
				<View key={index} style={{ marginBottom: 13 }}>
					<SwipeableItem
						wrapper={WRAPPER}
						id={index.toString()}
						date={item.date ? moment(item.date).format("MMM D, LT") : ""}
						mapItemsRef={mapItemsRef}
						onPressDelete={() => dapp.disconnect(item.connector)}
						name={item.name != "" ? item.name : "Unknown"}
						onPress={() => {}}
					/>
				</View>
			) : null,
		[],
	)

	const navToScanner = useCallback(openWalletConnectScan,[])

	const goBack = useCallback(() => navigation.goBack(), [])

	return (
		<>
			<StatusBar style="light" />

			<View style={styles.container}>
				<View style={[styles.safeArea]}>
					<Header
						onPressBack={goBack}
						style={styles.header}
						title={t("WalletConnect")}
						onPressScan={navToScanner}
					/>
					{connectors.length > 0 && (
						<>
							<Subtitle style={styles.caption}>Connessioni attive</Subtitle>
							<FlatList
								bounces={false}
								style={styles.flatlist}
								contentContainerStyle={styles.flatlistContent}
								data={connectors}
								renderItem={renderWallet}
							/>
						</>
					)}
					<View style={[styles.wrapper, { flex: 1 }]}>
						{connectors.length === 0 && (
							<>
								<Circles style={styles.circles}>
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
								mode="gradient"
								text={t("ScanQRCode")}
							/>
						</View>
					</View>
				</View>
			</View>
		</>
	)
}), false)

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
	circles: {
		marginBottom: s(10),
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
