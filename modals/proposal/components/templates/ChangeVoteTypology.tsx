import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { ButtonTypology, VoteTypology } from "../moleculs"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { s, vs } from "react-native-size-matters"

type Props = {
	typology: VoteTypology
	onPress(typology: VoteTypology): void
}

export default observer<Props>(({ typology, onPress }) => (
	<BottomSheetView style={styles.container}>
		<Text style={styles.title}>Proposal typology</Text>
		<ButtonTypology active={typology} style={styles.button} onPress={onPress} typology="text" />
		<ButtonTypology active={typology} onPress={onPress} />
	</BottomSheetView>
))

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		flex: 1,
		paddingTop: vs(15),
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",
		color: COLOR.White,

		marginBottom: vs(25),
	},
	button: {
		marginBottom: vs(18),
	},

	border: {
		padding: s(2),
	},
})
