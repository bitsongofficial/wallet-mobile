import { Button, ButtonProps } from "components/atoms"
import { StyleSheet } from "react-native"
import { vs } from "react-native-size-matters"

export default (props: ButtonProps) => (
	<Button contentContainerStyle={styles.buttonContent} textStyle={styles.buttonText} {...props} />
)

const styles = StyleSheet.create({
	buttonText: {
		fontSize: vs(16),
		lineHeight: vs(20),
	},
	buttonContent: { paddingVertical: vs(17) },
})
