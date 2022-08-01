import { Keyboard, Platform } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { Phrase, Steps } from "classes"
import { reaction } from "mobx"
import { AddAccount } from "./components/organisms"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}
	const steps = new Steps(["Choose", "Create", "Name", "Import"])
	const phrase = new Phrase()

	const disposer = reaction(
		() => steps.title,
		(title) => {
			switch (title) {
				case "Create":
					gbs.updProps({ snapPoints: ["95%"] })
					phrase.create()
					break
				case "Import":
					gbs.updProps({ snapPoints: ["95%"] })
					phrase.clear()
					break
				case "Name":
					gbs.updProps({ snapPoints: ["95%"] })
					break
				default:
					gbs.updProps({ snapPoints: [350] })
					break
			}
		},
	)

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	gbs.backHandler = () => goBack()

	await gbs.setProps({
		snapPoints: [350],
		keyboardBehavior: Platform.OS === "android" ? "interactive" : "fillParent",
		...props,
		onChange(index) {
			if (index === -1) {
				disposer()
				gbs.removeBackHandler()
				onClose && onClose()
			}
		},
		children: () => <AddAccount steps={steps} phrase={phrase} close={close} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
