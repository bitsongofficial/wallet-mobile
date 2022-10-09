import { useCallback, useMemo, useState, useEffect, useRef } from "react"
import { LayoutChangeEvent, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import QRCode from "react-native-qrcode-svg"
import { s, vs } from "react-native-size-matters"
import { useDimensions } from "@react-native-community/hooks"
import { observer } from "mobx-react-lite"
import { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet"
import * as Clipboard from "expo-clipboard"
import { useStore } from "hooks"
import { COLOR, hexAlpha, wait } from "utils"
import { trimAddress } from "utils/string"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { Icon2 } from "components/atoms"
import { Header } from "../components/atoms"
import { SelectCoin, SelectNetwork } from "../components/templates"
import { SupportedCoins } from "constants/Coins"
import { useTranslation } from "react-i18next"

type Props = {
	style: StyleProp<ViewStyle>
	close(): void
}

export default observer<Props>(function ReceiveModal({ style, close }) {
	const { t } = useTranslation()
	const { wallet, coin } = useStore()
	const { screen } = useDimensions()
	const [address, setAddress] = useState("")

	const [isCopied, setCopied] = useState(false)
	const [size, setSize] = useState(200)

	const shortAddress = useMemo(() => (address ? trimAddress(address) : ""), [address])

	const [isSelectingCoin, setIsSelectingCoin] = useState(true)
	const [selectedChain, setSelectedChain] = useState(SupportedCoins.BITSONG)

	const copyToClipboard = useCallback(async () => {
		if (address) {
			Clipboard.setString(address)
			setCopied(true)
			await wait(3000)
			setCopied(false)
		}
	}, [address])

	useEffect(() => {
		wallet.activeWallet?.wallets[selectedChain]?.Address().then(setAddress)
	}, [wallet.activeWallet?.wallets, selectedChain])

	const qrCodeLayoutEvent = useCallback((event: LayoutChangeEvent) =>
	{
		setSize(event.nativeEvent.layout.width)
	}, [])

	const activeCoin = coin.findAssetWithCoin(selectedChain)

	return (
		<BottomSheetView style={[styles.wrapper, style]}>
			{isSelectingCoin && <SelectNetwork
				onPress={(chain) => {
					setSelectedChain(chain)
					setIsSelectingCoin(false)
				}} />
			}
			{!isSelectingCoin && <>
				<Header title="Qr Code" subtitle="Scan to receive import" style={styles.header} />

				<View style={styles.addressBox} onLayout={qrCodeLayoutEvent}>
					<View style={styles.qr_code}>
						{address != "" && <QRCode value={address} size={size} />}
					</View>			
				</View>

				<View style={styles.card}>
					<Text style={styles.address}>{isCopied ? t("AddressCopied") : shortAddress}</Text>
					<TouchableOpacity style={styles.buttonCopy} onPress={copyToClipboard}>
						<Icon2 name="copy" stroke={hexAlpha(COLOR.White, 30)} size={17} />
					</TouchableOpacity>
				</View>
				<Text style={styles.subtitle} onPress={copyToClipboard}>
					{t("CopyAddress")}
				</Text>	
			</>}
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	wrapper: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		flex: 1,
	},

	header: {
		marginBottom: vs(22),
	},

	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		textAlign: "right",
		lineHeight: s(20),
		color: COLOR.RoyalBlue3,
		marginEnd: vs(20),
	},

	qr_code: {
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: vs(16),
		marginBottom: vs(8),
	},
	addressBox: {
		marginBottom: vs(20),
		marginHorizontal: s(16),
	},
	address: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: vs(14),
		lineHeight: vs(18),
		color: COLOR.White,
	},
	buttonCopy: {
		height: "100%",
		paddingHorizontal: HORIZONTAL_WRAPPER,
		alignItems: "center",
		justifyContent: "center",
	},

	card: {
		backgroundColor: COLOR.Dark3,
		height: vs(70),
		justifyContent: "space-between",
		flexDirection: "row",
		overflow: "hidden",
		borderRadius: s(20),
		paddingLeft: s(30),
		alignItems: "center",
		marginBottom: vs(4),
	},
})
