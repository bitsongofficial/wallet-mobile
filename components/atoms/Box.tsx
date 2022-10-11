import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { COLOR } from "utils"

type Props = {
	style?: StyleProp<ViewStyle>
}

export default ({children, style}: React.PropsWithChildren<Props>) =>
{
	return (
		<View style={[styles.container, style]}>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		backgroundColor: COLOR.Dark3,
		padding: 27,
		paddingTop: 33,
	},
})