import { ScrollView, ScrollViewProps, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR } from "utils"

type Props = {}

const BottomNavigator = (props: React.PropsWithChildren<ScrollViewProps>) => {
	return (
		<ScrollView
			style={styles.container}
			refreshControl={props.refreshControl}
		>
			<View style={styles.innerView}>
				{props.children}
			</View>
		</ScrollView>
	)
}

export default BottomNavigator

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
	},
	innerView: {
		paddingHorizontal: s(24),
		paddingTop: vs(11),
		paddingBottom: vs(114),
	},
})