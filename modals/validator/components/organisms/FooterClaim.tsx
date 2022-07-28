import { StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR } from "utils"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
	onPressBack(): void
	onPressDone?(): void
}

export default observer<Props>(({ onPressBack, onPressDone }) => {
	const insets = useSafeAreaInsets()
	return (
		<Footer
			style={{ bottom: insets.bottom, marginBottom: 16 }}
			Left={<ButtonBack onPress={onPressBack} />}
			Right={
				<Button
					text="Claim"
					contentContainerStyle={styles.buttonContent}
					textStyle={styles.buttonText}
					onPress={onPressDone}
					Right={<Icon2 name="chevron_right" style={styles.icon} size={18} stroke={COLOR.White} />}
				/>
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
