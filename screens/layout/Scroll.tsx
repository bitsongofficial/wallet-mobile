import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	
}

const Scroll = ({style, ...props}: ScrollViewProps) => {
	return (
		<ScrollView
			style={[styles.container, style]}
			{...props}
		>
			{props.children}
		</ScrollView>
	)
}

export default Scroll

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		felx: 1,
	}
})