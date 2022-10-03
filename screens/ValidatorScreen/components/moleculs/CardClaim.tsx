import { Icon2, ThemedGradient } from "components/atoms"
import { SupportedCoins } from "constants/Coins"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"
import { formatNumber } from "utils/numbers"
import { Caption, Card, Count } from "../atoms"

type Props = {
	style: StyleProp<ViewStyle>
	onPressClaim(): void
	value: number
	coin?: SupportedCoins
}

export default ({ style, onPressClaim, value, coin = SupportedCoins.BITSONG }: Props) => (
	<Card style={[styles.container, style]}>
		<View>
			<Caption style={styles.caption}>CLAIM</Caption>
			<Count value={formatNumber(value)} coinName={coin.toUpperCase()} />
		</View>
		<View>
			<RectButton onPress={onPressClaim}>
				<View style={styles.circle}>
					<ThemedGradient style={styles.gradient}>
						<Icon2 size={22} stroke={COLOR.White} name="claim" />
					</ThemedGradient>
				</View>
			</RectButton>
		</View>
	</Card>
)

const styles = StyleSheet.create({
	container: {
		paddingLeft: s(21),
		paddingRight: s(25),
		paddingVertical: s(24),

		flexDirection: "row",
		justifyContent: "space-between",
	},
	caption: {
		marginBottom: s(13),
	},
	circle: {
		width: s(62),
		height: s(62),
		borderRadius: s(62),
		overflow: "hidden",
	},
	gradient: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
})
