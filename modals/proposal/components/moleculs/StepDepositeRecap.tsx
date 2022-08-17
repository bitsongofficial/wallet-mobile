import { StyleSheet } from "react-native"
import { Recap } from "modals/validator/components/moleculs"

type Props = {
	amount: string
}

export default ({ amount }: Props) => (
	<Recap>
		<Recap.Title>Amout to Deposit</Recap.Title>
		<Recap.Amount>{amount}</Recap.Amount>
		<Recap.Stats>
			<Recap.Stat name="currency" value="BTSG" style={styles.stat} />
			<Recap.Stat name="proposal" value="769" />
		</Recap.Stats>
	</Recap>
)

const styles = StyleSheet.create({
	stat: { marginBottom: 16 },
})
