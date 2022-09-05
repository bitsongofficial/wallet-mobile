import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { Title } from "../atoms"
import { useMemo } from "react"
import { Icon2 } from "components/atoms"
import { Recap } from "modals/validator/components/moleculs"
import { useVoteIcon } from "modals/proposal/hooks"
import { SupportedCoins } from "constants/Coins"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"

type Props = {
	value: VoteOption
	chain: SupportedCoins
}

export default observer<Props>(({ value, chain }) => {
	const text = useMemo(() => {
		switch (value) {
			case VoteOption.VOTE_OPTION_YES:
				return "Yes"
			case VoteOption.VOTE_OPTION_NO:
				return "No"
			case VoteOption.VOTE_OPTION_NO_WITH_VETO:
				return "No Veto"
			case VoteOption.VOTE_OPTION_ABSTAIN:
				return "Abstain"
		}
	}, [value])

	const icon = useVoteIcon(value, true)

	return (
		<BottomSheetView style={styles.container}>
			<Title style={styles.title}>Vote Recap</Title>

			<Recap style={{ marginTop: 0, paddingBottom: 26 }}>
				<Recap.Title>Proposal 768</Recap.Title>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Recap.Amount style={{ marginBottom: 13 }}>{text}</Recap.Amount>
					<Icon2 name={icon} size={48} />
				</View>
				<Recap.Stats>
					<Recap.Stat nameStyle={{ width: 50 }} name="chain" value={chain} />
				</Recap.Stats>
			</Recap>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 30,
		paddingTop: 15,
	},
	title: { marginBottom: 31 },
})
