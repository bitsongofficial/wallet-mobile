import { Icon2 } from "components/atoms"
import { Image, StyleSheet, View } from "react-native"
import { COLOR } from "utils"
import { Caption, Title } from "../atoms"

export default () => {
	return (
		<>
			<View style={styles.iconContainer}>
				<Image source={require("assets/images/done.png")} style={styles.icon} />
			</View>

			<View>
				<Title style={styles.title}>Transaction Successful</Title>
				<Caption style={styles.caption}>
					Congratulations!{"\n"}
					Your transaction has been completed{"\n"}
					and confirmed by the blockchain.
				</Caption>
			</View>
		</>
	)
}

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
	icon: {
		width: 205,
		height: 205,
	},
})
