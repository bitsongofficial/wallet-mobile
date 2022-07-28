import { useCallback, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import * as Clipboard from "expo-clipboard"
import { Steps } from "classes"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Search, Subtitle, Title } from "../atoms"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ButtonAvatar } from "../moleculs"
import { useGlobalBottomsheet, useStore } from "hooks"
import { useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type Props = {
	close(): void
}

export default observer<Props>(({ close }) => {
	const { contacts } = useStore()
	const gbs = useGlobalBottomsheet()
	// const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	// ----------- Input ----------

	const inputWallet = useMemo(() => new InputHandler(), [])
	const inputName = useMemo(() => new InputHandler(), [])

	const pasteFromClipboard = useCallback(
		async () => inputWallet.set(await Clipboard.getStringAsync()),
		[],
	)

	// ------- Image ----------

	const [image, setImage] = useState<string>()

	const source = useMemo(() => (image ? { uri: image } : null), [image])

	// --------- Steps ------------

	const steps = useMemo(() => new Steps(["Add", "Name", "Avatar"]), [])
	const goBack = useCallback(() => (steps.active === -1 ? close() : steps.goBack()), [])

	const next = useCallback(() => {
		if (steps.title === "Add") {
			steps.goTo("Name")
		} else if (steps.title === "Name") {
			steps.goTo("Avatar")
		}
	}, [])

	const createContact = useCallback(() => {
		contacts.addContact({
			address: inputWallet.value,
			name: inputName.value,
			avatar: image, //  if skip create avatar neededr
		})
		close()
	}, [image])

	const scanContact = useCallback(() => {
		// gbs.closeSoft()
		// navigation.push("ScannerQR", {
		//   onBarCodeScanned: (data) =>
		//   {
		//     inputWallet.set(data)
		//     gbs.openSoft()
		//   }
		// })
	}, [gbs])

	return (
		<View style={styles.container}>
			{steps.title === "Add" && (
				<>
					<Title style={styles.title}>Add Contact</Title>
					<Search
						loupe={false}
						style={styles.search}
						placeholder="Public Address"
						value={inputWallet.value}
						onChangeText={inputWallet.set}
						Right={
							<TouchableOpacity style={styles.iconTouchable} onPress={scanContact}>
								<Icon2 name="qr_code" size={18} stroke={COLOR.RoyalBlue} />
							</TouchableOpacity>
						}
					/>
					<Subtitle style={styles.subtitle}>
						Access VIP experiences, exclusive previews,{"\n"}
						finance your own and have your say.
					</Subtitle>
				</>
			)}

			{steps.title === "Name" && (
				<>
					<Title style={styles.title}>Name your Contact</Title>
					<Search
						loupe={false}
						value={inputName.value}
						onChangeText={inputName.set}
						style={styles.search}
						placeholder="Write a name"
					/>
					<Subtitle style={styles.subtitle}>
						Access VIP experiences, exclusive previews,{"\n"}
						finance your own and have your say.
					</Subtitle>
				</>
			)}

			{steps.title === "Avatar" && (
				<>
					<Title style={styles.title}>Edit Profile Photo</Title>

					<View style={styles.avatar}>
						<ButtonAvatar source={source} onChange={setImage} />
					</View>
				</>
			)}

			<View style={styles.footer}>
				<View style={styles.footer_2}>
					<ButtonBack onPress={goBack} />
					{steps.title !== "Avatar" ? (
						<Button
							text="Continue"
							disable={steps.title === "Name" && inputName.value.length < 4}
							onPress={next}
							contentContainerStyle={styles.buttonContent}
							textStyle={styles.buttonText}
						/>
					) : (
						<Button
							text={image ? "Save" : "Skip"}
							onPress={createContact}
							contentContainerStyle={styles.buttonContent}
							textStyle={styles.buttonText}
						/>
					)}
				</View>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		// alignItems: "center",
		marginTop: 15,
		marginHorizontal: 26,
	},
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
		marginBottom: 36,
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		opacity: 0.5,

		textAlign: "center",

		marginBottom: 18,
	},

	avatar: {
		alignItems: "center",
	},

	search: {
		marginBottom: 24,
	},

	iconTouchable: {
		padding: 23,
	},

	footer: {
		flexGrow: 1,
		justifyContent: "flex-end",
		marginTop: 20,
	},

	footer_1: {
		alignItems: "center",
	},
	footer_2: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	buttonContent: {
		paddingHorizontal: 31,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 14,
		lineHeight: 18,
	},
})
