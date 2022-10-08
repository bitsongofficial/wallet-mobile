import { useCallback } from "react"
import { StyleSheet } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { useDimensions } from "@react-native-community/hooks"
import { COLOR } from "utils"
import { Contact } from "stores/ContactsStore"
import {
	openAddAccount,
	openAddContact,
	openAddWatchAcount,
	openChangeAvatar,
	openChangeCurrency,
	openChangeLanguage,
	openChangeWallet,
	openEditContact,
	openRemoveContact,
} from "modals/profile"

export default function useBottomSheetModals() {
	const { screen } = useDimensions()
	const animatedPosition = useSharedValue(screen.height)

	const props = {
		animatedPosition,
		backgroundStyle: styles.background,
	}

	const changeAvatar = useCallback(() => openChangeAvatar({ props }), [])
	const addWatchAccount = useCallback(() => openAddWatchAcount({ props }), [])
	const changeWallet = useCallback(() => openChangeWallet({ props }), [])
	const changeLanguage = useCallback(() => openChangeLanguage({ props }), [])
	const channgeCurrency = useCallback(() => openChangeCurrency({ props }), [])
	const addContact = useCallback(() => openAddContact({ props }), [])
	const removeContact = useCallback((contact: Contact) => openRemoveContact({ props, contact }), [])
	const editContact = useCallback((contact: Contact) => openEditContact({ props, contact }), [])
	const addAccount = useCallback(() => openAddAccount({ props }), [])

	return [
		animatedPosition,
		{
			changeAvatar,
			addAccount,
			addWatchAccount,
			changeWallet,
			changeLanguage,
			channgeCurrency,
			addContact,
			editContact,
			removeContact,
		},
	] as const
}

const styles = StyleSheet.create({
	background: {
		paddingTop: 30,
	},
})
