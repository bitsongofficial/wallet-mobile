import { Keyboard, StyleSheet } from "react-native"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { COLOR, wait } from "utils"
import { gbs } from "modals"
import { Button, Footer } from "components/atoms"
import { VoteRecap } from "./components/templates"
import { SupportedCoins } from "constants/Coins"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"

type Options = {
	value: VoteOption
	chain: SupportedCoins
	onClose?(): void
	onDone?(): void
}

export default async function openVote(options: Options) {
	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const done = () => {
		const { onDone } = options
		onDone && onDone()
		close()
	}

	const open = async () => {
		gbs.backHandler = () => {
			close()
		}

		await gbs.setProps({
			snapPoints: [404],
			enableContentPanningGesture: false,
			backgroundStyle: styles.background,
			animationConfigs: { duration: 400 },
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					options?.onClose && options.onClose()
				}
			},
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
			children: () => <VoteRecap value={options.value} chain={options.chain} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}

const styles = StyleSheet.create({
	background: { backgroundColor: COLOR.Dark2 },
	buttonContent: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
})
