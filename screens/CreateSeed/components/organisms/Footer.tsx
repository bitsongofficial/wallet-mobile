import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Button, ButtonBack, ButtonChevroletRight, Icon2 } from "components/atoms"
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
				<ButtonChevroletRight
					text={nextButtonText}
					onPress={onPressNext}
					textStyle={styles.buttonText}
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
	buttonText: {
		marginRight: s(24),
	},
})
