import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { animated, useSpring } from "@react-spring/native"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useStore, useTheme } from "hooks"
import { SendController } from "../../controllers"
import { CardAddress, CardAdressSelf } from "../moleculs"
import { Footer, User } from "../atoms"
import { isValidAddress } from "core/utils/Address"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Contact } from "stores/ContactsStore"

type Props = {
	controller: SendController
	onPressRecap(): void
	onPressScanner(): void
	onPressBack(): void
}

export default observer(function SelectReceiver({
	controller,
	onPressBack,
	onPressRecap,
	onPressScanner,
}: Props) {
	const { contacts, coin } = useStore()
	const theme = useTheme()
	const { creater } = controller
	const { addressInput } = creater

	const hidden = useSpring({ opacity: addressInput.isFocused ? 0.1 : 1 })
	useEffect(() => addressInput.focusOFF, [])

	const setAddress = (contact: Contact | string) => {
		if (typeof contact == "string") addressInput.set(contact)
		else addressInput.set(contact.address)
	}

	return (
		<>
			<BottomSheetScrollView style={{ flexGrow: 1 }}>
				<CardAddress input={addressInput} onPressQR={onPressScanner} style={styles.input} />

				<animated.View style={hidden}>
					{contacts.starred.length > 0 && (
						<>
							<Text style={[styles.subtitle, theme.text.primary]}>Prefered</Text>

							<View style={styles.users}>
								{contacts.starred.map((c) => (
									<TouchableOpacity
										key={c.address}
										onPress={() => {
											setAddress(c)
										}}
									>
										<User user={c} />
									</TouchableOpacity>
								))}
							</View>
						</>
					)}
					{coin.recentRecipients.length > 0 && (
						<>
							<Text style={[styles.subtitle, theme.text.primary]}>Recents</Text>
							<View style={[styles.users, { flexDirection: "column" }]}>
								{coin.recentRecipients.map((c) => (
									<TouchableOpacity
										key={c.address}
										onPress={() => {
											setAddress(c.address)
										}}
									>
										<CardAdressSelf address={c.address} date={c.date} style={styles.self} />
									</TouchableOpacity>
								))}
							</View>
						</>
					)}

					<Text style={[styles.subtitle, theme.text.primary]}>Self</Text>
					<TouchableOpacity
						onPress={() => {
							creater.coin && setAddress(creater.coin?.info.address)
						}}
					>
						<CardAdressSelf address={creater.coin?.info.address ?? ""} style={styles.self} />
					</TouchableOpacity>
				</animated.View>
			</BottomSheetScrollView>
			<Footer
				onPressBack={onPressBack}
				onPressCenter={onPressRecap}
				isActiveCenter={addressInput.value != "" && isValidAddress(addressInput.value)}
				centerTitle="Preview Send"
			/>
		</>
	)
})

const styles = StyleSheet.create({
	container: { flexGrow: 1 },
	input: {
		marginTop: 31,
		marginBottom: 26,
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
})
