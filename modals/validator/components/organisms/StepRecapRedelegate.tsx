import { StyleSheet } from "react-native"
import { Coin } from "classes"
import { IValidator } from "classes/types"
import { COLOR } from "utils"
import { Recap } from "../moleculs"

type Props = {
	from?: IValidator | null
	to?: IValidator | null
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
		paddingVertical: 32,
		paddingHorizontal: 20,
		borderRadius: 20,
		marginTop: 36,
	},
	stats: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},

	flex1: { flex: 1 },
	stat: { marginBottom: 16 },
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.RoyalBlue2,

		marginBottom: 12,
	},
	amount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
		color: COLOR.White,

		marginBottom: 8,
	},
})
