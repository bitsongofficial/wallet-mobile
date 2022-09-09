import { useCallback, useEffect } from "react"
import {
	ListRenderItem,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
	TouchableOpacity,
} from "react-native"
import { observer } from "mobx-react-lite"
import { animated, useSpring } from "@react-spring/native"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useStore, useTheme } from "hooks"
import { isValidAddress } from "core/utils/Address"
import { FlatList } from "react-native-gesture-handler"
import { Contact } from "stores/ContactsStore"
import { HORIZONTAL_WRAPPER } from "modals/wallets/constants"
import { SendController } from "../../controllers"
import { CardAddress, CardAdressSelf } from "../moleculs"
import { Footer, Contact as ContactItem } from "../atoms"

type Props = {
	controller: SendController
	onPressRecap(): void
	onPressScanner(): void
	onPressBack(): void

	style?: StyleProp<ViewStyle>
}

export default observer(function SelectReceiver({
	controller,
	onPressBack,
	onPressRecap,
	onPressScanner,
	style,
}: Props) {
	const { contacts: contactsStore, coin } = useStore()
	const theme = useTheme()
	const { creater } = controller
	const { addressInput } = creater

	const hidden = useSpring({ opacity: addressInput.isFocused ? 0.1 : 1 })
	useEffect(() => addressInput.focusOFF, [])

	const setAddress = (contact?: Contact | string) => {
		if (contact) {
			if (typeof contact == "string") addressInput.set(contact)
			else addressInput.set(contact.address)
		}
	}

	const renderContacts = useCallback<ListRenderItem<Contact>>(
		({ item, index }) => (
			<TouchableOpacity
				key={item.address}
				onPress={() => setAddress(item)}
				style={index !== contactsStore.contacts.length - 1 && styles.touchContact}
			>
				<ContactItem user={item} isActive={addressInput.value === item.address} />
			</TouchableOpacity>
		),
		[contactsStore.contacts.length],
	)

	return (
		<View style={style}>
			<BottomSheetScrollView style={{ flexGrow: 1 }} scrollEnabled={!addressInput.isFocused}>
				<View style={styles.wrapper}>
					<CardAddress
						input={addressInput}
						onPressQR={onPressScanner}
						style={styles.input}
						isError={
							addressInput.value != "" &&
							!addressInput.isFocused &&
							!isValidAddress(addressInput.value)
						}
					/>
				</View>

				<animated.View style={hidden}>
					{contactsStore.contacts.length > 0 && (
						<View style={styles.contacts}>
							<Text style={[styles.subtitle, styles.wrapper, theme.text.primary]}>Contacts</Text>
							<FlatList
								horizontal
								scrollEnabled={!addressInput.isFocused}
								data={contactsStore.contacts}
								renderItem={renderContacts}
								style={styles.contactList}
								contentContainerStyle={styles.contactListContent}
							/>
						</View>
					)}

					<View style={styles.wrapper}>
						<Text style={[styles.subtitle, theme.text.primary]}>Recents</Text>
						<TouchableOpacity onPress={() => setAddress(creater.coin?.info.address)}>
							<CardAdressSelf address={creater.coin?.info.address ?? ""} style={styles.self} />
						</TouchableOpacity>
					</View>
				</animated.View>
			</BottomSheetScrollView>

			<View style={styles.wrapper}>
				<Footer
					onPressBack={onPressBack}
					onPressCenter={onPressRecap}
					isActiveCenter={addressInput.value != "" && isValidAddress(addressInput.value)}
					centerTitle="Preview Send"
				/>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: { flexGrow: 1 },

	wrapper: { marginHorizontal: HORIZONTAL_WRAPPER },
	input: {
		marginTop: 31,
		marginBottom: 40,
	},
	hidden: { opacity: 0.1 },
	self: { marginTop: 21 },

	users: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 23,
		marginBottom: 40,
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
	},

	touchContact: { marginRight: 22 },
	contacts: { marginBottom: 32 },
	contactList: { marginTop: 18 },
	contactListContent: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		paddingBottom: 8,
	},
})

// const mockContacts: Contact[] = [
// 	{
// 		name: "Delogu",
// 		address: "bitsong1",
// 		avatar: "test",
// 		starred: true,
// 	},
// 	{
// 		name: "Vacchi",
// 		address: "bitsong2",
// 		avatar: "test",
// 		starred: true,
// 	},
// 	{
// 		name: "Aleandri",
// 		address: "bitsong3",
// 		avatar: "test",
// 		starred: false,
// 	},
// 	{
// 		name: "Rossi",
// 		address: "bitsong4",
// 		avatar: "test",
// 		starred: false,
// 	},

// 	{
// 		name: "Delogu",
// 		address: "bitsong1",
// 		avatar: "test",
// 		starred: true,
// 	},
// 	{
// 		name: "Vacchi",
// 		address: "bitsong2",
// 		avatar: "test",
// 		starred: true,
// 	},
// 	{
// 		name: "Aleandri",
// 		address: "bitsong3",
// 		avatar: "test",
// 		starred: false,
// 	},
// 	{
// 		name: "Rossi",
// 		address: "bitsong4",
// 		avatar: "test",
// 		starred: false,
// 	},
// ]
