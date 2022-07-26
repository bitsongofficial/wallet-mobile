import { Coin } from "classes"
import { IValidator } from "classes/types"
import { StyleSheet } from "react-native"
import { Recap } from "../moleculs"

type Props = {
	from?: IValidator | null
	coin: Coin | null
	amount: string
}

export default ({ amount, coin, from }: Props) => (
	<Recap>
		<Recap.Title>Amout to Undelegate</Recap.Title>
		<Recap.Amount>{amount || 0}</Recap.Amount>
		<Recap.Stats>
			<Recap.Stat name="currency" value={coin?.info.coinName} style={styles.stat} />
			<Recap.Stat
				name="from"
				value={!!from && <Recap.Value value={from.name} logo={from.logo} />}
			/>
		</Recap.Stats>
	</Recap>
)

const styles = StyleSheet.create({
	stat: { marginBottom: 16 },
})
