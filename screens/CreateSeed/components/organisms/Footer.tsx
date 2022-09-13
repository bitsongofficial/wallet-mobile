import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { useTheme } from "hooks"
import { COLOR } from "utils"
import { s, vs } from "react-native-size-matters"

type Props = {
	onPressBack(): void
	onPressNext(): void
	nextButtonText: string
	isHideNext?: boolean
	isDisableNext?: boolean
	style?: StyleProp<ViewStyle>
}

export default ({
	onPressBack,
	onPressNext,
	nextButtonText,
	style,
	isDisableNext,
	isHideNext,
}: Props) => {
	const theme = useTheme()
	return (
		<View style={[styles.container, style]}>
			<ButtonBack onPress={onPressBack} />
			{!isHideNext && (
				<Button
					text={nextButtonText}
					Right={<Icon2 name="chevron_right_2" size={18} stroke={COLOR.White} />}
					onPress={onPressNext}
					textStyle={[styles.buttonText, theme.text.primary]}
					contentContainerStyle={styles.buttonContent}
					disable={isDisableNext}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingBottom: vs(16),
	},
	buttonContent: {
		paddingVertical: s(18),
		paddingHorizontal: s(24),
		justifyContent: "space-between",
	},
	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		marginRight: s(24),
	},
})
