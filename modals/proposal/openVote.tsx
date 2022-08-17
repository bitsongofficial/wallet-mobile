import { Keyboard, StyleSheet } from "react-native"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { gbs } from "modals"
import { COLOR, wait } from "utils"
import { Button, Footer } from "components/atoms"
import { Vote, VoteController } from "./components/templates"
import { VoteValue } from "./components/moleculs"

type Options = {
	onClose?(): void
	onVote?(vote: VoteValue): void
}

export default async function openVote(options?: Options) {
	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const controller = new VoteController()

	const vote = () => {
		if (options) {
			const { onVote } = options
			onVote && onVote(controller.value)
		}
		close()
	}

	const open = async () => {
		gbs.backHandler = () => {
			close()
		}

		await gbs.setProps({
			snapPoints: [600],
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
									text="Vote & Sign"
									onPress={vote}
								/>
							}
						/>
					)}
				</SafeAreaInsetsContext.Consumer>
			),
			children: () => <Vote controller={controller} />,
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
