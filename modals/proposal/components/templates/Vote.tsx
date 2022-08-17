import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { COLOR, hexAlpha } from "utils"
import { makeAutoObservable } from "mobx"
import { Title } from "../atoms"
import { ButtonRadioVote, VoteValue } from "../moleculs"

export class VoteController {
	value: VoteValue = "yes"
	setVoteValue(value: VoteValue) {
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
			value="yes"
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value="no"
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value="no with veto"
		/>
		<ButtonRadioVote
			style={styles.button}
			onPress={controller.setVoteValue}
			active={controller.value}
			value="abstain"
		/>
	</BottomSheetView>
))

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 30,
		paddingTop: 25,
	},
	title: { marginBottom: 9 },
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
		color: hexAlpha(COLOR.White, 30),
		marginBottom: 27,
	},
	button: { marginBottom: 10 },
})
