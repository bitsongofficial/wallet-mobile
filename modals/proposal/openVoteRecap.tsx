import { Keyboard, StyleSheet } from "react-native"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { COLOR, wait } from "utils"
import { gbs } from "modals"
import { Button, Footer } from "components/atoms"
import { VoteRecap } from "./components/templates"
import { SupportedCoins } from "constants/Coins"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { s } from "react-native-size-matters"

type Options = {
	value: VoteOption
	chain: SupportedCoins
	onClose?(): void
	onDone?(): void
	onDismiss?(): void
}

export default async function openVote(options: Options) {
	const status = {done: false}
	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const done = () => {
		status.done = true
		const { onDone } = options
		onDone && onDone()
		close()
	}

	const open = async () => {
		gbs.backHandler = () => {
			close()
		}

		await gbs.setProps({
			snapPoints: [s(404)],
			enableContentPanningGesture: false,
			backgroundStyle: styles.background,
			animationConfigs: { duration: 400 },
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					options?.onClose && options.onClose()
					options?.onDismiss && !status.done && options?.onDismiss()
				}
			},
			children: () => <VoteRecap value={options.value} chain={options.chain} />,
			footerComponent: () => (
				<SafeAreaInsetsContext.Consumer>
					{(insets) => (
						<Footer
							style={{ marginBottom: 16 + (insets?.bottom || 0) }}
							Center={
								<Button
									contentContainerStyle={styles.buttonContent}
									textStyle={styles.buttonText}
									text="Confirm"
									onPress={done}
								/>
							}
						/>
					)}
				</SafeAreaInsetsContext.Consumer>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}

const styles = StyleSheet.create({
	background: { backgroundColor: COLOR.Dark2 },
	buttonContent: {
		paddingHorizontal: s(40),
		paddingVertical: s(18),
	},
	buttonText: {
		fontSize: s(16),
		lineHeight: s(20),
	},
})
