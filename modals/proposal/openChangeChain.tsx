import { Dimensions, Keyboard } from "react-native"
import { gbs } from "modals"
import { ChangeChain } from "./components/templates"
import { InputHandler, wait } from "utils"

type Options = {
	onClose?(): void
}

export default async function openChangeChain(options?: Options) {
	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const { height: windowHeight } = Dimensions.get("window")

	gbs.backHandler = () => {
		close()
	}

	const searchInput = new InputHandler()

	const open = async () => {
		await gbs.setProps({
			snapPoints: [windowHeight * 0.9],
			enableContentPanningGesture: false,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					options?.onClose && options.onClose()
				}
			},
			children: () => <ChangeChain searchInput={searchInput} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
