import { Icon2, ThemedGradient } from "components/atoms"
import { SupportedCoins } from "constants/Coins"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { formatNumber } from "utils/numbers"
import { Caption, Card, Count } from "../atoms"

type Props = {
	style: StyleProp<ViewStyle>
	onPressClaim(): void
	value: number,
	coin?: SupportedCoins,
}

export default ({ style, onPressClaim, value, coin=SupportedCoins.BITSONG }: Props) => {
	return (
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
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 21,
		paddingRight: 25,
		paddingVertical: 24,

		flexDirection: "row",
		justifyContent: "space-between",
	},
	caption: {
		marginBottom: 13,
	},
	circle: {
		width: 62,
		height: 62,
		borderRadius: 62,
		overflow: "hidden",
		backgroundColor: "red",
	},
	gradient: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
})
