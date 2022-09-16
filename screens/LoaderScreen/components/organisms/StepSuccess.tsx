import { Image, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { Caption, Title } from "../atoms"

type Props = {
	title?: string
	caption?: string
}

export default ({
	title = "Transaction Successful",
	caption = `Congratulations!${"\n"} Your transaction has been completed${"\n"} and confirmed by the blockchain.`,
}: Props) => {
	return (
		<>
			<View style={styles.iconContainer}>
				<Image source={require("assets/images/done.png")} style={styles.icon} />
			</View>

			<View>
				<Title style={styles.title}>{title}</Title>
				<Caption style={styles.caption}>{caption}</Caption>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		marginBottom: vs(24),
	},
	caption: {
		textAlign: "center",
	},
	iconContainer: {
		height: s(218),
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		width: s(205),
		height: s(205),
	},
})
