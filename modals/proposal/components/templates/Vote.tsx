import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { COLOR, hexAlpha } from "utils"
import { makeAutoObservable } from "mobx"
import { Title } from "../atoms"
import { ButtonRadioVote } from "../moleculs"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { s, vs } from "react-native-size-matters"

export class VoteController {
	value: VoteOption = VoteOption.VOTE_OPTION_YES
	setVoteValue(value: VoteOption) {
		this.value = value
	}
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}

type Props = {
	controller?: VoteController
}

export default observer<Props>(({ controller = new VoteController() }) => (
	<BottomSheetView style={styles.container}>
		<Title style={styles.title}>Vote</Title>
		<Text style={styles.caption}>You could overwrite your vote in any moment simply revoting.</Text>

		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value={VoteOption.VOTE_OPTION_YES}
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value={VoteOption.VOTE_OPTION_NO}
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value={VoteOption.VOTE_OPTION_NO_WITH_VETO}
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value={VoteOption.VOTE_OPTION_ABSTAIN}
		/>
	</BottomSheetView>
))

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: HORIZONTAL_WRAPPER,
		paddingTop: vs(25),
	},
	title: { marginBottom: s(9) },
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",
		color: hexAlpha(COLOR.White, 30),
		marginBottom: vs(27),
	},
	button: { marginBottom: vs(10) },
})
