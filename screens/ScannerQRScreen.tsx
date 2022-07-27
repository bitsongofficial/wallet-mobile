import { StyleSheet, Text, View } from "react-native"
import { useCallback, useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { BarCodeScanner } from "expo-barcode-scanner"
import { BarCodeScannedCallback } from "expo-barcode-scanner/build/BarCodeScanner"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "hooks"
import { ButtonBack } from "components/atoms"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "types"
import { observer } from "mobx-react-lite"
import { COLOR, hexAlpha } from "utils"

type Props = NativeStackScreenProps<RootStackParamList, "ScannerQR">

export default observer<Props>(({ navigation, route }) => {
	const theme = useTheme()

	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const [scanned, setScanned] = useState(false)
	const [uri, setUri] = useState("")

	useEffect(() => {
		;(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === "granted")
		})()
	}, [])

	useEffect(() => route.params.onClose, [])

	const goBack = useCallback(() => {
		navigation.goBack()
	}, [])

	const handleBarCodeScanned = useCallback<BarCodeScannedCallback>(
		({ data }) => {
			if (!scanned) {
				setScanned(true)
				goBack()
				route.params.onBarCodeScanned(data)
			}
		},
		[route, scanned, goBack],
	)

	const insets = useSafeAreaInsets()

	return (
		<>
			<StatusBar hidden />
			{hasPermission && (
				<BarCodeScanner
					barCodeTypes={["qr"]}
					onBarCodeScanned={handleBarCodeScanned}
					style={styles.scanner}
				/>
			)}
			<View style={styles.container}>
				<View style={styles.vertical} />
				<View>
					<View style={styles.horizontal} />
					<View>
						<View style={styles.fake}></View>
					</View>
					<View style={styles.horizontal}>
						<Text style={styles.text}>
							QR code will be detected{"\n"}
							automatically when {"\n"}
							lorem ispum
						</Text>
					</View>
				</View>
				<View style={styles.vertical} />
			</View>

			<View style={[styles.footer, { marginBottom: insets.bottom }]}>
				<View style={styles.buttonContainer}>
					<ButtonBack
						stroke={COLOR.Dark3}
						style={styles.button}
						textStyle={styles.buttonText}
						onPress={goBack}
					/>
				</View>
			</View>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "100%",
		height: "100%",

		flexDirection: "row",
		flex: 1,
	},

	vertical: {
		backgroundColor: hexAlpha(COLOR.Dark3, 80),

		flex: 1,
	},

	horizontal: {
		backgroundColor: hexAlpha(COLOR.Dark3, 80),
		flex: 1,
	},

	scanner: {
		flexGrow: 1,
		transform: [{ scale: 2 }],
	},

	fake: {
		height: 260,
		width: 260,
		borderRadius: 30,
		// backgroundColor: "magenta",
	},

	footer: {
		marginHorizontal: 30,
		position: "absolute",
		bottom: 0,
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		marginTop: 23,
		textAlign: "center",

		color: COLOR.White,
	},

	buttonContainer: { flexDirection: "row" },

	button: {
		backgroundColor: COLOR.White,
		borderRadius: 50,
		paddingHorizontal: 24,
		paddingVertical: 18,
		marginBottom: 16,
	},
	buttonText: {
		color: COLOR.Dark3,
	},
})
