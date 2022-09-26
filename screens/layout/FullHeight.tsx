import { ScrollView, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"

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
		paddingHorizontal: s(24),
		paddingTop: vs(50),
		paddingBottom: s(24),
		backgroundColor: COLOR.Dark3,
		felx: 1,
		height: "100%",
	}
})