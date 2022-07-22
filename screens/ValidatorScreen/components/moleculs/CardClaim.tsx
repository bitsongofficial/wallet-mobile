import { Icon2, ThemedGradient } from "components/atoms"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Caption, Card, Count } from "../atoms"

type Props = {
	style: StyleProp<ViewStyle>
}

export default ({ style }: Props) => {
	return (
		<Card style={[styles.container, style]}>
			<View>
				<Caption style={styles.caption}>CLAIM</Caption>
				<Count value="234.78" coinName="BTSG" />
			</View>
			<View>
				<View style={styles.circle}>
					<ThemedGradient style={styles.gradient}>
						<Icon2 size={22} stroke={COLOR.White} name="claim" />
					</ThemedGradient>
				</View>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 21,
		paddingRight: 25,
		paddingVertical: 24,

		flexDirection: "row",
		justifyContent: "space-between",
	},
	caption: {
		marginBottom: 13,
	},
	circle: {
		width: 62,
		height: 62,
		borderRadius: 62,
		overflow: "hidden",
		backgroundColor: "red",
	},
	gradient: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
})
