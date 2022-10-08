import { ScrollView, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {}

const FullHeight = (props: React.PropsWithChildren<Props>) => {
	return (
		<View style={styles.container}>
			{props.children}
		</View>
	)
}

export default FullHeight

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		paddingTop: vs(64),
		paddingBottom: s(24),
		backgroundColor: COLOR.Dark3,
		felx: 1,
		height: "100%",
	}
})