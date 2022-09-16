import { StyleSheet } from "react-native"
import { Coin } from "classes"
import { COLOR } from "utils"
import { Recap } from "../moleculs"
import { Validator } from "core/types/coin/cosmos/Validator"
import { s, vs } from "react-native-size-matters"

type Props = {
	from?: Validator | null
	to?: Validator | null
	coin: Coin | null
	amount: string
}

export default ({ amount, coin, from, to }: Props) => (
	<Recap>
		<Recap.Title>Amout to Redelegate</Recap.Title>
		<Recap.Amount>{amount || 0}</Recap.Amount>
		<Recap.Stats>
			<Recap.Stat name="currency" value={coin?.info.coinName} style={styles.stat} />
			<Recap.Stat
				name="from"
				style={styles.stat}
				value={!!from && <Recap.Value value={from.name} logo={from.logo} />}
			/>
			<Recap.Stat name="to" value={!!to && <Recap.Value value={to.name} logo={to.logo} />} />
		</Recap.Stats>
	</Recap>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingVertical: s(32),
		paddingHorizontal: s(20),
		borderRadius: s(20),
		marginTop: vs(36),
	},
	stats: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},

	flex1: { flex: 1 },
	stat: { marginBottom: vs(16) },
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.RoyalBlue2,

		marginBottom: vs(12),
	},
	amount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(42),
		lineHeight: s(53),
		color: COLOR.White,

		marginBottom: vs(8),
	},
})
