import { StyleSheet, View, ViewProps } from "react-native"
import { COLOR } from "utils"

export default (props: ViewProps) => <View {...props} style={[styles.card, props.style]} />

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLOR.Dark2,
		borderRadius: 20,
	},
})
