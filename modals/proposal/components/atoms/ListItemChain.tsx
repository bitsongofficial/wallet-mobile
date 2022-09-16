import { useCallback } from "react"
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { getAssetName, getAssetTag, getAssetIcon } from "core/utils/Coin"
import { SupportedCoins } from "constants/Coins"
import { s } from "react-native-size-matters"

type Props = {
	chain: SupportedCoins
	style?: StyleProp<ViewStyle>
	onPress(chain: SupportedCoins): any
}

export default ({ chain, style, onPress }: Props) => (
	<RectButton style={style} onPress={useCallback(() => onPress(chain), [chain])}>
		<View style={styles.container}>
			<Image source={{ uri: getAssetIcon(chain) }} style={styles.avatar} />
			<View style={styles.data}>
				<Text style={styles.tokenName}>{getAssetName(chain)}</Text>
				<Text style={styles.name}>{getAssetTag(chain)}</Text>
			</View>
		</View>
	</RectButton>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: s(16),
	},
	avatar: {
		width: s(24),
		height: s(24),
		borderRadius: s(24),
		backgroundColor: COLOR.Dark3,
		marginRight: s(24),
	},
	data: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	tokenName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.White,
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.RoyalBlue,
	},
})
