import { ScrollView, StyleSheet } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"

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
		paddingHorizontal: s(24),
		paddingTop: vs(50),
		paddingBottom: s(24),
		backgroundColor: COLOR.Dark3,
	}
})