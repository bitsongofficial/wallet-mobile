import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Steps } from "classes"
import { COLOR } from "utils"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { s } from "react-native-size-matters"

type Props = {
	onPressBack?(): void
	onPressDone?(): void
	style?: StyleProp<ViewStyle>
	steps: Steps<any>
}

export default observer<Props>(({ onPressBack, onPressDone, style, steps }) => {
	const insets = useSafeAreaInsets()
	return (
		<Footer
			style={{ bottom: insets.bottom, marginBottom: 8 }}
			Left={onPressBack && <ButtonBack onPress={onPressBack} />}
			Center={
				steps.active === 1 ? (
					<Button
						text="Continue"
						contentContainerStyle={styles.buttonContentCenter}
						textStyle={styles.buttonText}
						onPress={steps.next}
					/>
				) : steps.active === 2 ? (
					<Button
						text="Redelegate"
						contentContainerStyle={styles.buttonContentCenter}
						textStyle={styles.buttonText}
						onPress={onPressDone}
					/>
				) : undefined
			}
			Right={
				steps.active === 0 && (
					<Button
						text="Continue"
						contentContainerStyle={styles.buttonContent}
						textStyle={styles.buttonText}
						onPress={steps.next}
						Right={
							<Icon2 name="chevron_right" style={styles.icon} size={18} stroke={COLOR.White} />
						}
					/>
				)
			}
		/>
	)
})

const styles = StyleSheet.create({
	buttonText: {
		fontSize: s(16),
		lineHeight: s(20),
	},

	icon: {
		marginLeft: s(24),
	},
	buttonContent: {
		paddingHorizontal: s(24),
		paddingVertical: s(18),
	},
	buttonContentCenter: {
		paddingHorizontal: s(40),
		paddingVertical: s(18),
	},
})
