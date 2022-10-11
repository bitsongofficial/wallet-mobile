import { useCallback } from "react"
import { Image, StyleSheet, Text, View, ViewStyle, StyleProp, Animated } from "react-native"
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TouchableOpacity } from "react-native-gesture-handler"
import { observer } from "mobx-react-lite"
import { COLOR, hexAlpha } from "utils"
import { useLoading, useStore } from "hooks"
import { RootStackParamList } from "types"
import { Icon2, Loader } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { s } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	style?: StyleProp<ViewStyle>
	navigation?: NativeStackNavigationProp<RootStackParamList>
} & (BottomTabHeaderProps | NativeStackHeaderProps)

export default observer(function Header({ navigation, style }: Props) {
	const { wallet } = useStore()
	const { isOpen } = useLoading()
	const openProfile = useCallback(() => navigation?.navigate("Profile"), [])

	const insets = useSafeAreaInsets()

	return (
		<Animated.View style={[styles.container, style, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				{/* <View style={styles.left}>
					{!isOpen && <Icon2 name="logo" size={40} />}
					{isOpen && <Loader size={40} />}
				</View> */}

				<View style={styles.right}>
					{/* <Icon2 name="bell_1" size={16} stroke={COLOR.Marengo} /> */}
					<TouchableOpacity onPress={openProfile}>
						<Icon2
							name="user"
							style={styles.avatar}
							stroke={hexAlpha(COLOR.White, 80)}
							size={40}
						/>
						{/* <Image
							source={
								wallet.activeProfile && wallet.activeProfile.avatar
									? { uri: wallet.activeProfile.avatar }
									: require("assets/images/mock/avatar.png")
							}
							style={styles.avatar}
						/> */}
					</TouchableOpacity>
				</View>
			</View>
		</Animated.View>
	)
})

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "100%",
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: HORIZONTAL_WRAPPER,
		justifyContent: "flex-end",
		paddingVertical: s(10),
	},
	left: {
		position: "relative",
		left: -4,
	},
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
	right: {
		flexDirection: "row",
		justifyContent: "center",

		alignItems: "center",
	},
	avatar: {
		marginLeft: s(20),
		width: s(35),
		height: s(35),
		borderRadius: s(40),
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.White,
	},
})
