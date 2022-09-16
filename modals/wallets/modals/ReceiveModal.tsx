import { useCallback, useMemo, useState, useEffect } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import * as Clipboard from "expo-clipboard"
import QRCode from "react-native-qrcode-svg"
import { useDimensions } from "@react-native-community/hooks"
import { useStore } from "hooks"
import { COLOR, hexAlpha, wait } from "utils"
import { Icon2 } from "components/atoms"
import { Header } from "../components/atoms"
import { BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet"
import { trimAddress } from "utils/string"

type Props = {
	style: StyleProp<ViewStyle>
	close(): void
}

export default observer<Props>(function ReceiveModal({ style, close }) {
	const { wallet } = useStore()
	const { screen } = useDimensions()
	const [address, setAddress] = useState("")

	const [isCopied, setCopied] = useState(false)

	const shortAddress = useMemo(() => (address ? trimAddress(address) : ""), [address])

	const copyToClipboard = useCallback(async () => {
		if (address) {
			Clipboard.setString(address)
			setCopied(true)
			await wait(3000)
			setCopied(false)
		}
	}, [address])

	useEffect(() => {
		wallet.activeWallet?.wallets.btsg?.Address().then(setAddress)
	}, [wallet.activeWallet?.wallets.btsg])

	return (
		<BottomSheetView style={[styles.wrapper, style]}>
			<Header title="Qr Code" subtitle="Scan to receive import" style={styles.header} />

			<View style={styles.qr_code}>
				{address != "" && <QRCode value={address} size={screen.width * 0.7} />}
			</View>

			<Text style={styles.subtitle}>Copy address</Text>

			<View style={styles.card}>
				<Text style={styles.address}>{isCopied ? "Address Copied!" : shortAddress}</Text>
				<TouchableOpacity style={styles.buttonCopy} onPress={copyToClipboard}>
					<Icon2 name="copy" stroke={hexAlpha(COLOR.White, 30)} size={17} />
				</TouchableOpacity>
			</View>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	wrapper: {
		marginHorizontal: 30,
		flex: 1,
	},

	header: {
		marginBottom: 22,
	},

	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
		marginBottom: 22,
	},

	qr_code: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 19,
		marginBottom: 20,
	},

	address: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
	},
	buttonCopy: {
		height: "100%",
		paddingHorizontal: 30,
		alignItems: "center",
		justifyContent: "center",
	},

	card: {
		backgroundColor: COLOR.Dark3,
		height: 70,
		justifyContent: "space-between",
		flexDirection: "row",
		overflow: "hidden",
		borderRadius: 20,
		paddingLeft: 30,

		alignItems: "center",
	},

	footer: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		paddingBottom: 8,
		paddingTop: 15,
	},

	buttonContent: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
})
