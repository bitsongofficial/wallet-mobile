import { StyleSheet, View } from "react-native"
import { Button, GradientText, Icon2 } from "components/atoms"
import { useTheme } from "hooks"
import { COLOR } from "utils"
import { s } from "react-native-size-matters"

type Props = {
	isHidden: boolean
	onPress(): void
}

export default ({ isHidden, onPress }: Props) => {
	const theme = useTheme()
	return isHidden ? (
		<Button
			mode="gradient"
			text="Show Phrase"
			contentContainerStyle={styles.content}
			textStyle={[styles.text, theme.text.primary]}
			Right={
				<View style={styles.iconContainer}>
					<Icon2 name="eye" size={18} stroke={theme.text.primary.color} />
				</View>
			}
			onPress={onPress}
		/>
	) : (
		<Button
			mode="gradient_border"
			contentContainerStyle={styles.content_gradient}
			Right={<Icon2 name="eye_closed_gradient" size={18} />}
			onPress={onPress}
		>
			<GradientText style={[styles.text, theme.text.primary]}>Hide Phrase</GradientText>
		</Button>
	)
}

const styles = StyleSheet.create({
	content: {
		paddingVertical: s(13),
		paddingHorizontal: s(24),
		justifyContent: "space-between",
	},
	content_gradient: {
		paddingVertical: s(11),
		paddingHorizontal: s(22),
		borderRadius: s(50),
		justifyContent: "space-between",
		backgroundColor: COLOR.Dark3,
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),

		// marginRight: s(13),
	},

	iconContainer: {
		// paddingHorizontal: 25,
		alignItems: "center",
		justifyContent: "center",
	},
})
