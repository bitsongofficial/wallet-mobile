import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { COLOR } from "utils"

type Props = {
	style?: StyleProp<ViewStyle>
	children?: React.ReactNode
}

export default function Card({ children, style }: Props) {
	return <View style={[styles.container, style]}>{children}</View>
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		backgroundColor: COLOR.Dark2,
	},
})
