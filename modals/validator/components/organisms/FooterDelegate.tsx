import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Steps } from "classes"
import { COLOR } from "utils"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DelegateController } from "modals/validator/controllers"

type Props = {
	controller: DelegateController
	onPressBack?(): void
	onPressDone?(): void
	style?: StyleProp<ViewStyle>
	steps: Steps<any>
}

export default observer<Props>(({ controller, onPressBack, onPressDone, style, steps }) => {
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
						text="Delegate"
						contentContainerStyle={styles.buttonContentCenter}
						textStyle={styles.buttonText}
						onPress={onPressDone}
					/>
				) : undefined
			}
			Right={
				steps.active === 0 && (
					<Button
						disable={!(parseFloat(controller.amountInput.value) > 0 && parseFloat(controller.amountInput.value) <= (controller.amountInput.coin?.balance ?? 0))}
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
		fontSize: 16,
		lineHeight: 20,
	},

	icon: {
		marginLeft: 24,
	},
	buttonContent: {
		paddingHorizontal: 24,
		paddingVertical: 18,
	},
	buttonContentCenter: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
})
