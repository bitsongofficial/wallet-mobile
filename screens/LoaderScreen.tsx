import { useRef, useState, useEffect, useCallback } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { useTheme } from "hooks"
import { COLOR } from "utils"
import { RootStackParamList } from "../types"
import { Button, Icon2, Loader } from "components/atoms"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	StyleProps,
} from "react-native-reanimated"

type Status = "pending" | "fulfilled" | "rejected"

const subtitle = {
	pending: `Transaction has been broadcasted to${"\n"} the blockchain and pending${"\n"} confirmation.`,
	fulfilled: `Congratulations!${"\n"} Your transaction has been completed${"\n"} and confirmed by the blockchain.`,
	rejected: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.`,
}

const title = {
	pending: "Transaction Pending",
	fulfilled: "Transaction Successful",
	rejected: "Transaction Error",
}

export default function LoaderScreen({
	navigation,
	route,
}: NativeStackScreenProps<RootStackParamList, "Loader">) {
	const theme = useTheme()

	const Header = route.params?.header
	const goBack = useCallback(() => navigation.goBack(), [])

	const [status, setStatus] = useState<Status>("fulfilled")

	const result = useRef()
	const error = useRef()

	useEffect(() => {
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
	}, [])

	// ------------ Footer ---------------

	const insets = useSafeAreaInsets()
	const bottomShift = useSharedValue(0)

	useEffect(() => {
		if (status === "fulfilled") {
			bottomShift.value = 0
		} else {
			bottomShift.value = 108 + insets.bottom
		}
	}, [status])

	const footerStyle = useAnimatedStyle(() => ({
		bottom: withTiming(-bottomShift.value, {
			duration: 300,
			easing: Easing.ease,
		}),
		position: "absolute",
		width: "100%",
		paddingHorizontal: 30,
	}))

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.safeArea}>
				{Header && <Header navigation={navigation} />}
				<Image
					style={{
						position: "absolute",
						// right: 0,
						// top: 0,
					}}
					source={require("assets/images/Ellipse_light.png")}
				/>
				<View style={{ flex: 1, justifyContent: "space-evenly", paddingVertical: 60 }}>
					<View style={styles.iconContainer}>
						{status == "pending" && <Loader size={80} />}
						{status == "fulfilled" && <Icon2 name="loader_done" size={218} />}
						{status == "rejected" && <Icon2 name="loader_error" size={218} stroke={COLOR.Pink} />}
					</View>

					<View>
						<Text style={[styles.title, theme.text.primary]}>{title[status]}</Text>
						<Text style={styles.subtitle}>{subtitle[status]}</Text>
					</View>

					<Footer style={footerStyle} onPressBack={goBack} />
				</View>
			</SafeAreaView>
		</>
	)
}

type FooterProps = {
	style: StyleProps
	onPressBack?(): void
	onPressMintscan?(): void
}

const Footer = ({ style, onPressBack, onPressMintscan }: FooterProps) => (
	<Animated.View style={style}>
		<Button
			text="Confirm"
			onPress={onPressBack}
			contentContainerStyle={styles.buttonContent}
			textStyle={styles.buttonText}
		/>
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Button
				text="View on Mintscan"
				mode="fill"
				onPress={onPressMintscan}
				contentContainerStyle={styles.buttonContent}
				textStyle={styles.buttonText}
				Right={<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />}
			/>
		</View>
	</Animated.View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flexGrow: 1,
		backgroundColor: COLOR.Dark3,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "700",
		fontSize: 20,
		lineHeight: 25,

		textAlign: "center",
		marginBottom: 24,
	},
	subtitle: {
		color: COLOR.Marengo,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",
	},
	iconContainer: {
		height: 218,
		alignItems: "center",
		justifyContent: "center",
	},
	// Button
	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
	},
	buttonContent: { paddingVertical: 17 },
})
