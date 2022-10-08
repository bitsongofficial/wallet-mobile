import { useCallback, useEffect, useState } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import { trimAddress } from "utils/string"
import { ProfileWallets } from "stores/WalletStore"
import { WalletTypes } from "core/types/storing/Generic"
import { s } from "react-native-size-matters"

type Props = {
	wallet: ProfileWallets | null
	onPress(wallet: ProfileWallets | null): void
	style?: StyleProp<ViewStyle>
}

export default ({ onPress, wallet, style }: Props) => {
	const handlePress = useCallback(() => onPress(wallet), [onPress, wallet])
	const [address, setAddress] = useState("")
	useEffect(() => {
		wallet?.wallets.btsg
			//
			.Address()
			.then(trimAddress)
			.then(setAddress)
	})
	return (
		<RectButton onPress={handlePress} style={style}>
			<View style={styles.container}>
				<Icon2
					size={18}
					name={wallet?.profile.type == WalletTypes.WATCH ? "eye" : "wallet"}
					stroke={hexAlpha(COLOR.White, 40)}
					style={styles.icon}
				/>
				<View style={styles.info}>
					<Text style={styles.name}>{wallet?.profile.name}</Text>
				</View>
				<Icon2 size={13} name="chevron_down" stroke={hexAlpha(COLOR.White, 80)} />
			</View>
		</RectButton>
	)
}

const styles = StyleSheet.create({
	container: {
		height: s(64),
		backgroundColor: hexAlpha(COLOR.White, 10),
		paddingLeft: s(24),
		paddingRight: s(24),
		borderRadius: s(20),
		flexDirection: "row",
		alignItems: "center",
	},
	icon: { marginRight: s(16) },
	info: { flex: 1 },
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.White,
	},
	address: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(15),
		color: COLOR.RoyalBlue4,
	},
})
