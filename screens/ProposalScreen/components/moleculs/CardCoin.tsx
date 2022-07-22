import { memo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"

type Props = {
	title: string
}

export default memo(({ title }: Props) => (
	<View style={styles.container}>
		<Text style={styles.name}>{title}</Text>
		<View style={styles.right}>
			{/* <Image /> */}
			<View style={styles.image} />
			<Icon2 name="chevron_down" stroke={COLOR.White} />
		</View>
	</View>
))

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
		paddingVertical: 23,
		borderRadius: 20,
		backgroundColor: COLOR.Dark2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		color: COLOR.White,
	},
	right: {
		flexDirection: "row",
		alignItems: "center",
	},
	image: {
		width: 24,
		height: 24,
		borderRadius: 24,
		backgroundColor: COLOR.Marengo,
		marginRight: 16,
	},
})
