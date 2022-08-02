import { useCallback, useMemo, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Search, Title } from "../atoms"
import { RectButton } from "react-native-gesture-handler"
import { Steps } from "classes"
import { ButtonAvatar } from "../moleculs"
import { runInAction } from "mobx"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "types"
import { Contact } from "stores/ContactsStore"
import { useGlobalBottomsheet, useStore } from "hooks"
import { isValidAddress } from "core/utils/Address"

type Props = {
	contact: Contact | null
	steps: Steps<"Data" | "Photo">
	close(): void
	navigation: NativeStackNavigationProp<RootStackParamList>
}

export default observer<Props>(({ close, contact, steps, navigation }) => {
	const { contacts } = useStore()
	const gbs = useGlobalBottomsheet()
	const goBack = useCallback(() => (steps.active > 0 ? steps.goBack() : close()), [steps.active])

	const inputAddress = useMemo(() => new InputHandler(contact?.address), [contact?.address])
	const inputNickname = useMemo(() => new InputHandler(contact?.name), [contact?.name])

	const navToScan = useCallback(() => {
		gbs.closeSoft()
		navigation.navigate("ScannerQR", {
			onBarCodeScanned: (data) => {
				inputAddress.set(data)
				gbs.openSoft()
			},
		})
	}, [gbs])

	// ------- Image ----------

	const [image, setImage] = useState<string | null>(null)

	const source = useMemo(
		() => (contact?.avatar || image ? { uri: image || contact?.avatar } : null),
		[image],
	)

	// -------------------------

	const save = useCallback(() => {
		if (contact) {
			contacts.editAddress(contact, inputAddress.value)
			contacts.editName(contact, inputNickname.value)
			if (image) {
				contacts.editAvatar(contact, image)
			}
		}
		close()
	}, [image])

	return (
		<View style={styles.container}>
			{steps.title === "Data" && (
				<>
					<Title style={styles.title}>Edit Contact</Title>

					<View style={{ marginBottom: 24 }}>
						<Text style={styles.label}>Edit address</Text>
						<Search
							value={inputAddress.value}
							onChangeText={inputAddress.set}
							loupe={false}
							Right={
								<RectButton style={styles.button_qr} onPress={navToScan}>
									<Icon2 name="qr_code" stroke={COLOR.RoyalBlue} size={22} />
								</RectButton>
							}
						/>
					</View>

					<View>
						<Text style={styles.label}>Edit name</Text>
						<Search value={inputNickname.value} onChangeText={inputNickname.set} loupe={false} />
					</View>
				</>
			)}

			{steps.title === "Photo" && (
				<>
					<Title style={styles.title}>Edit Profile Photo</Title>
					<View style={styles.avatar}>
						<ButtonAvatar source={source} onChange={setImage} />
					</View>
				</>
			)}

			<View style={styles.footer}>
				<View style={styles.buttons}>
					<ButtonBack onPress={goBack} />

					{steps.title === "Data" ? (
						<Button
							disable={!isValidAddress(inputAddress.value.trim()) || inputNickname.value.length < 4}
							text="Continue"
							onPress={steps.next}
							textStyle={styles.buttonText}
							contentContainerStyle={styles.buttonContent}
						/>
					) : (
						<Button
							onPress={save}
							text="Save"
							textStyle={styles.buttonText}
							contentContainerStyle={styles.buttonContent}
						/>
					)}
				</View>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		marginTop: 15,
		marginHorizontal: 26,
		marginBottom: 32,
		flex: 1,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
		marginBottom: 36,
	},
	label: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,

		marginBottom: 8,
	},
	avatar: {
		alignItems: "center",
	},

	// ------ Footer ----------

	footer: {
		flexGrow: 1,
		justifyContent: "flex-end",
	},

	button_qr: {
		padding: 23,
	},

	buttons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	button: { backgroundColor: COLOR.Dark2 },
	buttonContent: {
		paddingVertical: 18,
		paddingHorizontal: 46,
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
})
