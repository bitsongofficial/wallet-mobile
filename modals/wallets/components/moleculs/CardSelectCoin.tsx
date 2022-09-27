import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Coin } from "classes"
import { useTheme } from "hooks"
import { COLOR, hexAlpha } from "utils"
import { Card, Icon2 } from "components/atoms"
import { mvs, s, vs } from "react-native-size-matters"
import { formatNumber } from "utils/numbers"

type Props = {
	coin?: Coin | null
	style?: StyleProp<ViewStyle>
}

export default observer<Props>(function CardWallet({ coin, style }) {
	const theme = useTheme()
	return (
		<Card style={[styles.card, style]}>
			<View style={styles.left}>
				<Text style={[styles.title, theme.text.primary]}>{coin?.info.brand}</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-around",
					}}
				>
					<Text style={styles.balance}>
						{formatNumber(coin?.info.balance ?? 0)} {coin?.info.coinName}
					</Text>
					<Image source={require("assets/images/mock/logo_bitsong.png")} style={styles.image} />
				</View>
			</View>
			<Icon2 name="chevron_right" size={18} stroke={COLOR.RoyalBlue} />
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
