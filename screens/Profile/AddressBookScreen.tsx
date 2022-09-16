import { useCallback, useEffect, useMemo } from "react"
import {
	Keyboard,
	ListRenderItem,
	SectionList,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RectButton, Swipeable, TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { observable, toJS } from "mobx"
import { RootStackParamList } from "types"
import { useStore } from "hooks"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { Button, Icon2, Input, ThemedGradient } from "components/atoms"
import { Circles, Subtitle, Title } from "./components/atoms"
import { ContactItem } from "./components/moleculs"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useBottomSheetModals } from "./hooks"
import { Contact } from "stores/ContactsStore"
import { s, vs } from "react-native-size-matters"

type Props = NativeStackScreenProps<RootStackParamList, "AddressBook">

const WRAPPER = s(34)

export default observer<Props>(function AddressBookScreen({ navigation }) {
	const { contacts } = useStore()
	const [position, openModal] = useBottomSheetModals()

	// ------- Wallets ------
	const mapItemsRef = useMemo(() => observable.map<Contact, React.RefObject<Swipeable>>(), [])

	const renderContact = useCallback<ListRenderItem<Contact>>(
		({ item }) => (
			<View style={styles.contact}>
				<ContactItem
					value={item}
					wrapper={WRAPPER}
					onPressStar={contacts.toggleStarred}
					onPressDelete={openModal.removeContact}
					onPressEdit={openModal.editContact}
					mapItemsRef={mapItemsRef}
				/>
			</View>
		),
		[],
	)

	const renderSectionHeader = useCallback(
		({ section }) => (
			<View style={styles.section}>
				<Text style={styles.label}>{section.label}</Text>
			</View>
		),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [])

	const animStyle = useAnimatedStyle(() => {
		const opacity = interpolate(position.value, [0, 350], [0, 0.5])
		return {
			flex: 1,
			opacity,
		}
	})

	const inputSearch = useMemo(() => new InputHandler(), [])
	const sectionData = contacts.labelContacts(contacts.contacts, inputSearch.value)

	useEffect(() => inputSearch.clear, [])
	const insets = useSafeAreaInsets()

	const addContact = useCallback(() => {
		openModal.addContact()
		Keyboard.dismiss()
	}, [])

	return (
		<>
			<StatusBar style="light" />

			<ThemedGradient invert style={styles.container}>
				<View style={[styles.safeArea, { paddingTop: insets.top }]}>
					<Animated.View style={animStyle}>
						<Header
							onPressBack={goBack}
							style={styles.header}
							title="Address Book"
							onPressPlus={addContact}
						/>
						<View style={styles.wrapper}>
							<Input
								value={inputSearch.value}
								onChangeText={inputSearch.set}
								placeholder="Search Address"
								style={styles.search}
								inputStyle={styles.searchInput}
								placeholderTextColor={COLOR.PaleCornflowerBlue}
								Right={
									<View style={styles.searchIconContainer}>
										<Icon2 name="loupe" stroke={COLOR.PaleCornflowerBlue} size={21} />
									</View>
								}
							/>
						</View>

						{true ? (
							<SectionList
								style={styles.sectionList}
								keyExtractor={({ address }) => address}
								contentContainerStyle={styles.sectionListContent}
								sections={sectionData}
								renderItem={renderContact}
								renderSectionHeader={renderSectionHeader}
							/>
						) : (
							<View style={[styles.wrapper, { flex: 1 }]}>
								<Circles style={{ marginVertical: vs(40) }}>
									<Icon2 name="address_book" size={69} stroke={COLOR.White} />
								</Circles>
								<View style={{ flex: 1 }}>
									<Title style={styles.title}>You haven’t yet added any contacts. </Title>
									<Subtitle style={styles.subtitle}>
										Access VIP experiences, exclusive previews, finance your own music projects and
										have your say.
									</Subtitle>
								</View>
							</View>
						)}
						<View style={styles.buttonContainer}>
							<Button
								text="Add Contact"
								onPress={openModal.addContact}
								textStyle={styles.buttonText}
								contentContainerStyle={styles.buttonContent}
							/>
						</View>
					</Animated.View>
				</View>
			</ThemedGradient>
		</>
	)
})

type PropsHeader = {
	onPressBack(): void
	onPressPlus(): void
	style?: StyleProp<ViewStyle>
	title?: string
}

const Header = ({ onPressBack, style, title, onPressPlus }: PropsHeader) => (
	<View style={[styles.header_container, style]}>
		<View style={styles.header_left}>
			<TouchableOpacity onPress={onPressBack} style={styles.header_backButton}>
				<Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
			</TouchableOpacity>
			<Title style={{ marginLeft: 19, fontSize: 18 }}>{title}</Title>
		</View>
		<View style={styles.header_right}>
			<View style={styles.header_scanButtonContainer}>
				<RectButton style={styles.header_scanButton} onPress={onPressPlus}>
					<Icon2 name="plus" size={18} stroke={COLOR.White} />
				</RectButton>
			</View>
		</View>
	</View>
)

const styles = StyleSheet.create({
	container: { flex: 1 },
	safeArea: { flex: 1 },
	header: {
		marginBottom: vs(25),
		paddingVertical: s(10),
		paddingHorizontal: s(20),
	},

	head: {
		marginHorizontal: s(25), // <- wrapper
		marginBottom: vs(30),
	},

	wrapper: {
		marginHorizontal: s(34),
	},

	sectionList: { marginTop: vs(10) },
	sectionListContent: {
		paddingTop: s(30),
		paddingBottom: s(70),
	},
	section: {
		marginBottom: 8,
		marginHorizontal: s(34),
	},
	label: { color: hexAlpha(COLOR.White, 40) },
	contact: { marginBottom: s(12) },

	title: {
		fontSize: vs(18),
		lineHeight: vs(24),
		textAlign: "center",
		marginBottom: vs(25),
	},
	subtitle: {
		fontSize: vs(15),
		lineHeight: vs(18),
		textAlign: "center",
		opacity: 0.3,
	},

	buttonContainer: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		alignItems: "center",
		paddingVertical: s(16),
		zIndex: 10,
	},
	buttonContent: {
		paddingHorizontal: s(55),
		paddingVertical: s(18),
		backgroundColor: COLOR.Dark3,
	},
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},

	// ------- Header ----------
	header_container: { flexDirection: "row" },
	header_left: { flexDirection: "row" },
	header_backButton: {
		padding: s(5),
		borderRadius: s(20),
	},
	header_right: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	header_scanButtonContainer: {
		width: s(33),
		height: s(33),
		borderRadius: s(33),
		backgroundColor: COLOR.Dark3,
		overflow: "hidden",
	},
	header_scanButton: {
		width: s(33),
		height: s(33),
		alignItems: "center",
		justifyContent: "center",
	},

	// ------- BottomSheet --------
	bottomSheetBackground: {
		backgroundColor: COLOR.Dark3,
		paddingTop: vs(30),
	},
	//
	search: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		borderRadius: s(20),
	},
	searchInput: {
		height: s(62),
	},
	searchIconContainer: {
		paddingHorizontal: s(25),
		alignItems: "center",
		justifyContent: "center",
	},
})
