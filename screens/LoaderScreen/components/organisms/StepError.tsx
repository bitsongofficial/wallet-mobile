import { Icon2 } from "components/atoms"
import { Image, StyleSheet, View } from "react-native"
import { COLOR } from "utils"
import { Caption, Title, Button } from "../atoms"

type Props = {
	onPressBack(): void
}

export default ({ onPressBack }: Props) => (
	<>
		<View style={styles.iconContainer}>
			<Image source={require("assets/images/error.png")} style={styles.icon} />
		</View>

		<View>
			<Title style={styles.title}>Transaction Error</Title>
			<Caption style={styles.caption}>
				Lorem ipsum dolor sit amet,{"\n"}
				consectetur adipiscing elit,{"\n"}
				sed do eiusmod tempor.
			</Caption>
		</View>

		<View style={styles.buttonContainer}>
			<Button
				text="Back to homescreen"
				mode="fill"
				onPress={onPressBack}
				Right={<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />}
			/>
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
	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		width: "100%",
	},

	icon: {
		width: 205,
		height: 205,
	},
})
