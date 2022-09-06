import { StyleSheet } from "react-native"
import { Recap } from "modals/validator/components/moleculs"
import { SupportedCoins } from "constants/Coins"
import { getAssetName, getAssetTag } from "core/utils/Coin"

type Props = {
	amount: string
	chain: SupportedCoins
	proposalId: Long
}

export default ({ amount, proposalId, chain }: Props) => (
	<Recap>
		<Recap.Title>Amout to Deposit</Recap.Title>
		<Recap.Amount>{amount}</Recap.Amount>
		<Recap.Stats>
			<Recap.Stat name="currency" value={getAssetTag(chain)} style={styles.stat} />
			<Recap.Stat name="proposal" value={proposalId.toString()} />
		</Recap.Stats>
	</Recap>
)

const styles = StyleSheet.create({
	stat: { marginBottom: 16 },
})
