import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { ButtonTypology, VoteTypology } from "../moleculs"
import { COLOR } from "utils"

type Props = {
	typology: VoteTypology
	onPress(typology: VoteTypology): void
}

export default observer<Props>(({ typology, onPress }) => {
	return (
		<BottomSheetView style={styles.container}>
			<Text style={styles.title}>Proposal typology</Text>
			<ButtonTypology active={typology} style={styles.button} onPress={onPress} typology="text" />
			<ButtonTypology active={typology} onPress={onPress} typology="software" />
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		flex: 1,
		paddingTop: 15,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
		color: COLOR.White,

		marginBottom: 35,
	},
	button: {
		marginBottom: 18,
	},

	border: {
		padding: 2,
	},
})
