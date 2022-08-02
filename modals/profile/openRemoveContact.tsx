import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { Contact } from "stores/ContactsStore"
import { RemoveContact } from "./components/organisms"

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

	gbs.backHandler = () => close()

	await gbs.setProps({
		snapPoints: [270],
		...props,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
			}
		},
		children: () => <RemoveContact close={close} contact={contact} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
