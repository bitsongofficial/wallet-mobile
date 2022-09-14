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
import { s, vs } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = NativeStackScreenProps<RootStackParamList, "ScannerQR">

export default observer<Props>(({ navigation, route }) => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const [scanned, setScanned] = useState(false)

	useEffect(() => {
		BarCodeScanner.requestPermissionsAsync()
			//
			.then(({ status }) => setHasPermission(status === "granted"))
			.catch((error) => console.error("Catched", error))
	}, [])

	useEffect(() => route.params.onClose, [])

	const goBack = useCallback(() => navigation.goBack(), [])

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
					<View style={styles.fake} />
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
				<ButtonBack
					stroke={COLOR.Dark3}
					style={styles.button}
					textStyle={styles.buttonText}
					onPress={goBack}
				/>
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
		height: s(260),
		width: s(260),
		borderRadius: s(30),
		// backgroundColor: "magenta",
	},

	footer: {
		marginHorizontal: HORIZONTAL_WRAPPER,
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: vs(14),
		lineHeight: vs(18),
		marginTop: vs(23),
		textAlign: "center",

		color: COLOR.White,
	},

	button: {
		backgroundColor: COLOR.White,
		borderRadius: s(50),
		paddingHorizontal: s(24),
		paddingVertical: s(18),
		marginBottom: s(16),
	},
	buttonText: {
		color: COLOR.Dark3,
	},
})
