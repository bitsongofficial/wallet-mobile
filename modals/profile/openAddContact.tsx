import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { navigationRef } from "navigation/utils"
import { AddContact, FooterAddContact, ControllerAddContact } from "./components/organisms"
import { s } from "react-native-size-matters"
import { store } from "stores/Store"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const { contacts } = store

	const controller = new ControllerAddContact()
	const { steps, inputName, inputWallet } = controller

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	const scan = () => {
		close()
		navigationRef.current?.navigate("ScannerQR", {
			onBarCodeScanned: inputWallet.set,
			onClose: open,
		})
	}

	const createContact = () => {
		contacts.addContact({
			address: inputWallet.value.trim(),
			name: inputName.value.trim(),
			avatar: controller.image || undefined, //  if skip create avatar neededr
		})
		close()
	}

	const next = () => {
		if (steps.title === "Add") {
			steps.goTo("Name")
		} else if (steps.title === "Name") {
			steps.goTo("Avatar")
		}
	}

	const open = () => {
		gbs.backHandler = () => goBack()
		gbs.setProps({
			snapPoints: [s(350)],
			...props,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			children: () => (
				<AddContact
					onPressScan={scan}
					controller={controller}
					//
				/>
			),
			footerComponent: () => (
				<FooterAddContact
					controller={controller}
					onPressBack={goBack}
					onPressSave={createContact}
					onPressNext={next}
				/>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
