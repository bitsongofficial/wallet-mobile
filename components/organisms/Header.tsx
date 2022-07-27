import { Image, StyleSheet, Text, View, ViewStyle } from "react-native"
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Icon } from "components/atoms"
import { COLOR } from "utils"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useCallback } from "react"
import { StyleProp } from "react-native"
import { useStore } from "hooks"
import { RootStackParamList } from "types"
import { observer } from "mobx-react-lite"

type Props = {
	style?: StyleProp<ViewStyle>
	navigation: NativeStackNavigationProp<RootStackParamList>
} & (BottomTabHeaderProps | NativeStackHeaderProps)

export default observer(function Header({ navigation, style }: Props) {
	const { wallet } = useStore()
	const openProfile = useCallback(() => navigation?.push("Profile"), [])

	return (
		<View style={[styles.container, style]}>
			<View style={styles.header}>
				<View style={styles.right}>
					<Icon name="cosmo" size={40} />
				</View>
				<View style={styles.center}>
					<Text style={styles.title}>Cosmonautico</Text>
				</View>
				<View style={styles.left}>
					<Icon name="bell" size={15} fill="#202020" />
					<TouchableOpacity onPress={openProfile}>
						<Image
							source={
								wallet.activeProfile && wallet.activeProfile.avatar
									? { uri: wallet.activeProfile.avatar }
									: require("assets/images/mock/avatar.png")
							}
							style={styles.avatar}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 80,
		backgroundColor: COLOR.Dark3,
		justifyContent: "flex-end",
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 25,
		justifyContent: "space-between",
	},
	right: {},
	center: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	icon: {
		position: "absolute",
		right: 0,
	},
	left: {
		flexDirection: "row",
		justifyContent: "center",

		alignItems: "center",
	},
	avatar: {
		marginLeft: 20,
		width: 35,
		height: 35,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
	},
})
