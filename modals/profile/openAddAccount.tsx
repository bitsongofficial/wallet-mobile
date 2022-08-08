import { Keyboard } from "react-native"
import { BottomSheetFooterProps, BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { reaction } from "mobx"
import { wait } from "utils"
import { store } from "stores/Store"
import { AddAccount, FooterAddAccount } from "./components/organisms"
import { ControllerAddAccount } from "./controllers"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		gbs.close()
		wait(400).then(Keyboard.dismiss)
	}

	const controller = new ControllerAddAccount()

	const onChangeTitle = (title: string) => {
		switch (title) {
			case "Create":
				gbs.updProps({ snapPoints: ["95%"] })
				controller.phrase.create()
				break
			case "Import":
				gbs.updProps({ snapPoints: ["95%"] })
				controller.phrase.clear()
				break
			case "Name":
				gbs.updProps({ snapPoints: ["95%"] })
				break
			default:
				gbs.updProps({ snapPoints: [350] })
				break
		}
	}

	const goBack = () => (controller.steps.history.length > 1 ? controller.steps.goBack() : close())

	gbs.backHandler = () => goBack()

	const saveWallet = () => {
		const { nameInput, phrase } = controller
		const { wallet } = store
		if (nameInput.value && phrase.isValid) {
			close()
			wallet.newCosmosWallet(nameInput.value, phrase.words)
		}
	}

	const open = async () => {
		const disposer = reaction(() => controller.steps.title, onChangeTitle)

		await gbs.setProps({
			snapPoints: [350],
			keyboardBehavior: "interactive",
			...props,
			onChange(index) {
				if (index === -1) {
					disposer()
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			footerComponent: (props: BottomSheetFooterProps) => (
				<FooterAddAccount
					{...props}
					controller={controller}
					onPressAddWallet={saveWallet}
					onPressBack={goBack}
				/>
			),
			children: () => <AddAccount controller={controller} />,
		})

		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
