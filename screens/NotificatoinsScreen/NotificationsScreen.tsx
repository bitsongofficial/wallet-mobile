import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, Text, TextProps, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { FlatList, RectButton } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { RootStackParamList } from "types"
import { useStore, useToggle } from "hooks"
import { Notif } from "stores/NotificationsStore"
import { Button, Icon2, Input, Loader } from "components/atoms"
import moment from "moment"
import { observer, Observer } from "mobx-react-lite"

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">

export default observer(function NotificationScreen({}: Props) {
	// -------------------- Data ----------------------

	const { notifications } = useStore()
	const data = useMemo(() => [...notifications.list].reverse(), [notifications.list.length])

	// --------------- Search -----------------------
	const [isOpenSearch, toggleSearch] = useToggle()

	const search = useMemo(() => new InputHandler(), [])
	const filtred = useMemo(() => {
		if (search.value) {
			const lowerCase = search.value.toLowerCase()
			return data.filter(({ message }) => message.toLowerCase().includes(lowerCase))
		} else {
			return data
		}
	}, [search.value, data])

	const renderNotif = useCallback<ListRenderItem<Notif>>(
		({ item }) => (
			<Observer
				render={() => (
					<View style={styles.notif}>
						<View>
							<Text style={[styles.notifMessage, item.date && { opacity: 0.4 }]}>
								{item.message}
							</Text>
						</View>

						<View>
							{item.date ? (
								<Text style={styles.notifDate}>{moment(item.date).fromNow()}</Text>
							) : (
								<Loader size={20} />
							)}
						</View>
					</View>
				)}
			/>
		),
		[],
	)

	return (
		<>
			<StatusBar style="light" />

			<View style={styles.head}>
				<View style={styles.row}>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Title>Notifications</Title>
						<Button
							text="clear all"
							mode="fill"
							onPress={notifications.clear}
							style={styles.button}
							contentContainerStyle={styles.buttonContent}
							textStyle={styles.buttonText}
						/>
					</View>

					<RectButton onPress={toggleSearch}>
						<Icon2 name="loupe" size={20} stroke={hexAlpha(COLOR.White, isOpenSearch ? 100 : 20)} />
					</RectButton>
				</View>

				{isOpenSearch && (
					<Input
						value={search.value}
						onChangeText={search.set}
						placeholder="Search"
						inputStyle={{ height: 52 }}
						style={{ borderRadius: 50, height: 52, marginTop: 20 }}
					/>
				)}
			</View>

			<FlatList
				bounces={false}
				data={filtred}
				style={styles.flatlist}
				contentContainerStyle={styles.content}
				renderItem={renderNotif}
			/>
		</>
	)
})

const Title = (props: TextProps) => (
	<Text
		{...props}
		style={{
			fontFamily: "CircularStd",
			fontStyle: "normal",
			fontWeight: "500",
			fontSize: 18,
			lineHeight: 23,
			color: COLOR.White,
		}}
	/>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	flatlist: {
		paddingHorizontal: 30,
		backgroundColor: COLOR.Dark3,
	},

	head: {
		paddingHorizontal: 30,
		backgroundColor: COLOR.Dark3,
		paddingBottom: 15,
		paddingTop: 15,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	content: {},

	button: { backgroundColor: COLOR.Dark2, marginLeft: 25 },
	buttonContent: {
		paddingHorizontal: 12,
		paddingVertical: 3,
	},
	buttonText: {
		fontSize: 11,
		lineHeight: 14,
	},

	notif: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: COLOR.Dark2,
		alignItems: "center",
		justifyContent: "space-between",
	},
	notifMessage: {
		paddingVertical: 20,

		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
	},
	notifDate: {
		color: COLOR.RoyalBlue5,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 15,
	},
})
