import { ScrollView, StyleSheet } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {}

const Standard = (props: React.PropsWithChildren<Props>) => {
	return (
		<ScrollView style={styles.container}>
			{props.children}
		</ScrollView>
	)
}

export default Standard

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		paddingTop: vs(50),
		paddingBottom: s(24),
		backgroundColor: COLOR.Dark3,
	}
})