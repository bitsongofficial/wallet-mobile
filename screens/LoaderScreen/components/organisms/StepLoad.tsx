import { StyleSheet, View } from "react-native"
import { Loader } from "components/atoms"
import { Caption, Title } from "../atoms"

export default () => (
	<>
		<View style={styles.iconContainer}>
			<Loader size={80} />
		</View>

		<View>
			<Title style={styles.title}>Transaction Pending</Title>
			<Caption style={styles.caption}>
				Transaction has been broadcasted to{"\n"}
				the blockchain and pending{"\n"}
				confirmation.
			</Caption>
		</View>
	</>
)

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		marginBottom: 24,
	},
	caption: {
		textAlign: "center",
	},
	iconContainer: {
		height: 218,
		alignItems: "center",
		justifyContent: "center",
	},
})
