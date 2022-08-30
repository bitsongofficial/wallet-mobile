import { useCallback } from "react"
import { Image, StyleSheet, Text, View, ViewStyle, StyleProp, Animated } from "react-native"
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TouchableOpacity } from "react-native-gesture-handler"
import { observer } from "mobx-react-lite"
import { COLOR } from "utils"
import { useStore } from "hooks"
import { RootStackParamList } from "types"
import { Icon } from "components/atoms"

type Props = {
	style?: StyleProp<ViewStyle>
	navigation: NativeStackNavigationProp<RootStackParamList>
} & (BottomTabHeaderProps | NativeStackHeaderProps)

export default observer(function Header({ navigation, style, options, ...props }: Props) {
	const { wallet } = useStore()
	const openProfile = useCallback(() => navigation?.navigate("Profile"), [])

	return (
		<Animated.View style={[styles.container, options?.headerStyle, style]}>
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
		</Animated.View>
	)
})

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: COLOR.Dark3,
		justifyContent: "flex-end",
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: 25,
		justifyContent: "space-between",
		paddingVertical: 15,
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
		borderRadius: 40,
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
