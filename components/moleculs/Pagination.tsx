import { Dot } from "components/atoms"
import { StyleSheet, View } from "react-native"
import { s } from "react-native-size-matters"

type PaginationProps = {
	acitveIndex: number
	count: number
}

export default ({ count, acitveIndex }: PaginationProps) => (
	<View style={styles.container}>
		{new Array(count).fill(null).map((_, index) => (
			<Dot key={index} active={index === acitveIndex} style={styles.dot} />
		))}
	</View>
)

const styles = StyleSheet.create({
	container: { flexDirection: "row" },
	dot: { marginRight: s(4) },
})
