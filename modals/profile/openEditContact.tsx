import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { reaction } from "mobx"
import { Contact } from "stores/ContactsStore"
import { store } from "stores/Store"
import { navigationRef } from "navigation/utils"
import { EditContact, FooterEditContact, ControllerEditContact } from "./components/organisms"

type Options = {
	contact: Contact
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

const snapPoints = {
	Data: [460],
	Photo: [410],
}

export default async function openChangeAvatar({ props, onClose, contact }: Options) {
	const { contacts } = store

	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const controller = new ControllerEditContact()

	const { steps, inputAddress, inputNickname, image } = controller

	const goBack = () => (steps.active > 0 ? steps.goBack() : close())

	const scan = () => {
		close()
		navigationRef.current?.navigate("ScannerQR", {
			onBarCodeScanned: inputAddress.set,
			onClose: open,
		})
	}

	const save = () => {
		if (contact) {
			contacts.editAddress(contact, inputAddress.value)
			contacts.editName(contact, inputNickname.value)
			if (image) {
				contacts.editAvatar(contact, image)
			}
		}
		close()
	}

	const disposer = reaction(
		() => steps.title,
		(title) => gbs.updProps({ snapPoints: snapPoints[title] }),
	)

	const open = () => {
		gbs.backHandler = () => goBack()
		gbs.setProps({
			snapPoints: snapPoints[steps.title],
			...props,
			onChange(index) {
				if (index === -1) {
					disposer()
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			footerComponent: () => (
				<FooterEditContact
					steps={steps}
					onPressBack={goBack}
					onPressDone={save}
					onPressNext={steps.next}
				/>
			),
			children: () => (
				<EditContact
					controller={controller}
					onPressScan={scan}
					contact={contact}
					//
				/>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
