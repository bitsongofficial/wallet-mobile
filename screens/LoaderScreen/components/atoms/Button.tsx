import { Button, ButtonProps } from "components/atoms"
import { StyleSheet } from "react-native"

export default (props: ButtonProps) => (
	<Button contentContainerStyle={styles.buttonContent} textStyle={styles.buttonText} {...props} />
)

const styles = StyleSheet.create({
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
	buttonContent: { paddingVertical: 17 },
})
