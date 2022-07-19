import { Image, StyleSheet, Text, View, ViewStyle } from "react-native"
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Icon } from "components/atoms"
import { COLOR } from "utils"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useCallback } from "react"
import { StyleProp } from "react-native"

type Props = {
	style?: StyleProp<ViewStyle>
} & (BottomTabHeaderProps | NativeStackHeaderProps)

export default function Header({ navigation, style }: Props) {
	const openProfile = useCallback(() => navigation?.push("Profile"), [])

	return (
		<View style={[styles.container, style]}>
			<View style={styles.header}>
				<View style={styles.right}>
					<Icon name="cosmo" size={40} />
				</View>
				<View style={styles.center}>
					<View>
						<Text style={styles.title}>Cosmosnautico</Text>
					</View>
					<Icon name="bell" size={15} fill="#202020" style={styles.icon} />
				</View>
				<View style={styles.left}>
					<TouchableOpacity onPress={openProfile}>
						<Image source={require("assets/images/mock/avatar.png")} style={styles.avatar} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

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
