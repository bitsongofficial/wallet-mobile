import { useCallback } from "react"
import { BackHandler, Platform, StyleSheet } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { useDimensions } from "@react-native-community/hooks"
import { reaction } from "mobx"
import { Phrase, Steps } from "classes"
import { useGlobalBottomsheet } from "hooks"
import { COLOR } from "utils"
import {
	AddWatchAccount,
	ChangeAvatar,
	ChangeCurrency,
	ChangeLanguage,
	ChangeWallet,
	AddAccount,
	AddContact,
	EditContact,
	RemoveContact,
} from "../components/organisms"
import { useNavigation } from "@react-navigation/native"
import { Contact } from "stores/ContactsStore"
import { RootStackParamList } from "types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function useBottomSheetModals() {
	const gbs = useGlobalBottomsheet()
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

	const { screen } = useDimensions()
	const animatedPosition = useSharedValue(screen.height)

	const close = useCallback(() => gbs.close(), [])

	const changeAvatar = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: [350],
			animatedPosition,
			backgroundStyle: styles.background,
			android_keyboardInputMode: undefined,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <ChangeAvatar close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const addWatchAccount = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: [350],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <AddWatchAccount close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const changeWallet = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: ["95%"],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <ChangeWallet close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const changeLanguage = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: ["95%"],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <ChangeLanguage close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const channgeCurrency = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: ["95%"],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <ChangeCurrency close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const addContact = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: [350],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <AddContact close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const removeContact = useCallback(async (contact: Contact) => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			close()
			return true
		})
		await gbs.setProps({
			snapPoints: [270],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				backHandler.remove()
			},
			children: () => <RemoveContact close={close} contact={contact} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const editContact = useCallback(async (contact: Contact) => {
		const steps = new Steps(["Data", "Photo"])
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

		const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			goBack()
			return true
		})

		await gbs.setProps({
			snapPoints: [410],
			animatedPosition,
			backgroundStyle: styles.background,
			onClose: () => {
				disposer()
				backHandler.remove()
			},
			children: () => (
				<EditContact close={close} contact={contact} steps={steps} navigation={navigation} />
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const addAccount = useCallback(async () => {
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

		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			goBack()
			return true
		})

		await gbs.setProps({
			snapPoints: [350],
			animatedPosition,
			backgroundStyle: styles.background,
			keyboardBehavior: Platform.OS === "android" ? "interactive" : "fillParent",

			onClose: () => {
				disposer()
				backHandler.remove()
			},

			children: () => <AddAccount steps={steps} phrase={phrase} close={close} />,
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

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
		close,
	] as const
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: COLOR.Dark3,
		paddingTop: 30,
	},
})
