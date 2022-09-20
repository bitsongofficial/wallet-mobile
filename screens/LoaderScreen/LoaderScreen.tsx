import { useRef, useState, useEffect, useCallback } from "react"
import { Image, StyleSheet, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { COLOR } from "utils"
import { RootStackParamList } from "types"
import { FooterSuccess } from "./components/moleculs"
import { StepError, StepLoad, StepSuccess } from "./components/organisms"
import { vs } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { EventListenerCallback, EventMapBase, EventMapCore } from "@react-navigation/native"

type Status = "pending" | "fulfilled" | "rejected"

export default function LoaderScreen({
	navigation,
	route,
}: NativeStackScreenProps<RootStackParamList, "Loader">) {
	const Header = route.params?.header
	const goBack = useCallback(() => navigation.goBack(), [])

	const [status, setStatus] = useState<Status>("pending")

	const result = useRef()
	const error = useRef()
	useEffect(
		() =>
		{
			const listener = () =>
			{
				navigation.removeListener("transitionEnd", listener)
				setTimeout(() => {
					route.params
						?.callback()
						.then((r) => {
							result.current = r
							if (r) setStatus("fulfilled")
							else setStatus("rejected")
						})
						.catch((e) => {
							error.current = e
							setStatus("rejected")
						})

					return () => {
						if (route.params) {
							const { onError, onSucceess } = route.params
							onError && onError(error.current)
							onSucceess && onSucceess(result.current)
						}
					}
				}, 500)
			}
			navigation.addListener("transitionEnd", listener)
		},
		[navigation, route.params],
	)

	// ------------ Footer ---------------

	const insets = useSafeAreaInsets()
	const bottomShift = useSharedValue(vs(108) + insets.bottom)

	useEffect(() => {
		if (status === "fulfilled") {
			bottomShift.value = 0
		} else {
			bottomShift.value = vs(108) + insets.bottom
		}
	}, [status])

	const footerStyle = useAnimatedStyle(() => ({
		bottom: withTiming(-bottomShift.value, {
			duration: 300,
			easing: Easing.ease,
		}),
		position: "absolute",
		width: "100%",
		paddingHorizontal: HORIZONTAL_WRAPPER,
	}))

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.safeArea}>
				{Header && <Header navigation={navigation} />}

				<Image
					style={{ position: "absolute" }}
					source={require("assets/images/Ellipse_light.png")}
				/>

				<View style={styles.content}>
					{status == "pending" && <StepLoad />}
					{status == "fulfilled" && <StepSuccess />}
					{status == "rejected" && <StepError onPressBack={goBack} />}

					<FooterSuccess
						style={footerStyle}
						onPressConfirm={goBack}
						// onPressMintscan={() => {}}
					/>
				</View>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flexGrow: 1,
		backgroundColor: COLOR.Dark3,
	},
	content: {
		flex: 1,
		justifyContent: "space-evenly",
		paddingVertical: vs(80),
	},
	title: {
		textAlign: "center",
		marginBottom: vs(24),
	},
	caption: {
		textAlign: "center",
	},
	iconContainer: {
		height: vs(218),
		alignItems: "center",
		justifyContent: "center",
	},

	buttonContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
})
