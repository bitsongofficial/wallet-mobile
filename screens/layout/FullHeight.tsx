import { ScrollView, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	horizontalPadding: boolean
}

const FullHeight = ({
	horizontalPadding = true,
	...props
}: React.PropsWithChildren<Props>) => {
	return (
		<View style={[styles.container, horizontalPadding && styles.horizontalPadding]}>
			{props.children}
		</View>
	)
}

export default FullHeight

const styles = StyleSheet.create({
	container: {
		paddingTop: vs(64),
		paddingBottom: s(24),
		backgroundColor: COLOR.Dark3,
		felx: 1,
		height: "100%",
	},
	horizontalPadding: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
	}
})