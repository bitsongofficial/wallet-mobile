import { StyleSheet } from "react-native"
import { Coin } from "classes"
import { Validator } from "core/types/coin/cosmos/Validator"
import { Recap } from "../moleculs"
import { vs } from "react-native-size-matters"

type Props = {
	selectedValidator?: Validator | null
	coin: Coin | null
	amount: string
}

export default ({ amount, coin, selectedValidator }: Props) => (
	<Recap>
		<Recap.Title>Amout to Delegate</Recap.Title>
		<Recap.Amount>{amount || 0}</Recap.Amount>
		<Recap.Stats>
			<Recap.Stat name="currency" value={coin?.info.coinName} style={styles.stat} />
			<Recap.Stat
				name="stake to"
				value={
					!!selectedValidator && (
						<Recap.Value value={selectedValidator.name} logo={selectedValidator.logo} />
					)
				}
			/>
		</Recap.Stats>
	</Recap>
)

const styles = StyleSheet.create({
	stat: { marginBottom: vs(16) },
})
