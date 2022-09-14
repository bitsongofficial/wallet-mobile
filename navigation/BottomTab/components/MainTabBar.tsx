import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { ThemedGradient } from "components/atoms"
import { StyleSheet, View } from "react-native"
import { s } from "react-native-size-matters"
import TabButton from "./TabButton"

export default function MyTabBar(props: BottomTabBarProps) {
	const { navigation } = props

	const onPress = (route: any, isFocused: boolean) => {
		const event = navigation.emit({
			canPreventDefault: true, // ?
			type: "tabPress",
			target: route.key,
		})

		if (!isFocused && !event.defaultPrevented) {
			navigation.navigate(route.name)
		}
	}

	const onLongPress = (route: any) =>
		navigation.emit({
			type: "tabLongPress",
			target: route.key,
		})

	return (
		<View style={styles.container}>
			<ThemedGradient style={styles.gradient}>
				{props.state.routes.map((route, index) => (
					<TabButton
						key={index}
						{...props}
						route={route}
						index={index}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				))}
			</ThemedGradient>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		height: s(56),
		bottom: s(34),
		left: 0,
		right: 0,
		marginHorizontal: "15%",
		borderRadius: s(50),
		overflow: "hidden",
	},
	gradient: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		paddingHorizontal: s(36),
	},
})
