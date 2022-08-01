import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { Steps } from "classes"
import { reaction } from "mobx"
import { Contact } from "stores/ContactsStore"
import { EditContact } from "./components/organisms"
import { InputHandler } from "utils"
import { navigationRef } from "navigation/utils"

type Options = {
	contact: Contact
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose, contact }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const steps = new Steps(["Data", "Photo"])

	const goBack = () => (steps.active > 0 ? steps.goBack() : close())

	const inputAddress = new InputHandler(contact?.address)
	const inputNickname = new InputHandler(contact?.name)

	const scan = () => {
		close()
		navigationRef.current?.navigate("ScannerQR", {
			onBarCodeScanned: inputAddress.set,
			onClose: open,
		})
	}

	const disposer = reaction(
		() => steps.title,
		(title) => {
			switch (title) {
				case "Data":
					gbs.updProps({ snapPoints: [460] })
					break
				case "Photo":
				default:
					gbs.updProps({ snapPoints: [410] })
					break
			}
		},
	)

	gbs.backHandler = () => goBack()

	const open = () => {
		gbs.setProps({
			snapPoints: [410],
			...props,
			onChange(index) {
				if (index === -1) {
					disposer()
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			children: () => (
				<EditContact
					inputAddress={inputAddress}
					inputNickname={inputNickname}
					onPressScan={scan}
					close={close}
					contact={contact}
					steps={steps}
				/>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}
}
