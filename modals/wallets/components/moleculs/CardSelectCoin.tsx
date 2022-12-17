import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Coin } from "classes"
import { useStore, useTheme } from "hooks"
import { COLOR, hexAlpha } from "utils"
import { Card, Icon2 } from "components/atoms"
import { mvs, s, vs } from "react-native-size-matters"
import { formatNumber } from "utils/numbers"
import { Asset } from "stores/models/Asset"

type Props = {
	asset?: Asset
	chain?: string
	style?: StyleProp<ViewStyle>
}

export default observer<Props>(function CardWallet({ asset, chain, style }) {
	const theme = useTheme()
	const { coin } = useStore()
	const balance = asset ? coin.balanceOfAsExponent(asset, chain) : 0
	return (
		<Card style={[styles.card, style]}>
			<View style={styles.left}>
				<Text style={[styles.title, theme.text.primary]}>{asset?.tag}</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-around",
					}}
				>
					<Text style={styles.balance}>
						{formatNumber(balance ?? 0)} {asset?.name}
					</Text>
				</View>
			</View>
			<Icon2 name="chevron_right" size={18} stroke={COLOR.White} />
		</Card>
	)
})

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLOR.Dark3,
		height: vs(70),
		alignItems: "center",
		padding: vs(23),
		flexDirection: "row",
		justifyContent: "space-between",
	},
	left: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		marginRight: s(16),
	},
	image: {
		width: s(27),
		height: s(27),
		marginLeft: s(16),
		tintColor: hexAlpha(COLOR.White, 20),
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: vs(15),
		lineHeight: vs(19),

		marginRight: vs(17),
	},
	balance: {
		color: COLOR.RoyalBlue,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		// lineHeight: '111.1%',
	},
})
