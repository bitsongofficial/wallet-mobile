import { Icon2, ThemedGradient } from "components/atoms"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { ButtonChain } from "../atoms"

type Props = {
	onPressNew(): void
	onPressChain(): void
	chain: string
}

export default ({ chain, onPressChain, onPressNew }: Props) => (
	<View style={[styles.head]}>
		<Text style={styles.title}>Proposals</Text>
		<View style={{ flexDirection: "row" }}>
			<ButtonChain style={{ marginRight: s(12) }} onPress={onPressChain} logo={chain} />
			<TouchableOpacity style={styles.buttonPlus} onPress={onPressNew}>
				<ThemedGradient style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Icon2 name="plus" stroke={COLOR.White} size={18} />
				</ThemedGradient>
			</TouchableOpacity>
		</View>
	</View>
)

const styles = StyleSheet.create({
	head: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: vs(24),
		marginRight: s(21),
		marginLeft: s(30),
		alignItems: "center",
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		color: COLOR.White,
	},
	buttonPlus: {
		width: s(44),
		height: s(44),
		borderRadius: s(44),
		backgroundColor: COLOR.Grey1,
		overflow: "hidden",
	},
})
