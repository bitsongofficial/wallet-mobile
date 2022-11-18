import { ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	style?: ViewStyle
}

const HorizontalWrapper = (props: React.PropsWithChildren<Props>) => {
	return (
		<View style={[styles.horizontalPadding, props.style]}>
			{props.children}
		</View>
	)
}

export default HorizontalWrapper

const styles = StyleSheet.create({
	horizontalPadding: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
	}
})