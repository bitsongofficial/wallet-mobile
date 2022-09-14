import { useCallback, useEffect, useMemo, useState } from "react"
import { BackHandler, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "types"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Header } from "components/organisms"
import { StatusBar } from "expo-status-bar"
import { Pin } from "classes"
import { useStore } from "hooks"
import { PinCode } from "./CreateSeed/components/moleculs"
import { Numpad } from "components/moleculs"
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated"
import { StepLock, StepSuccess } from "./LoaderScreen/components/organisms"
import { Button, Caption, Title } from "./LoaderScreen/components/atoms"
import moment from "moment"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { vs } from "react-native-size-matters"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = NativeStackScreenProps<RootStackParamList, "PinRequest">

// ----- Animation ----------
const ANGLE = 15
const TIME = 200
const EASING = Easing.elastic(1.5)

export default observer<Props>(({ navigation, route }) => {
	const {
		callback,
		title = "Confirm with PIN",
		errorMax = 3,
		disableVerification = false,
		isRandomKeyboard = true,
	} = route.params
	const { wallet, settings } = useStore()

	const goBack = useCallback(() => navigation.goBack(), [])

	const pin = useMemo(() => new Pin(), [])

	const [isConfirm, setConfirm] = useState<boolean | null>(null)
	const [countError, setErrorCount] = useState(0)

	const isError = isConfirm !== null && !isConfirm

	// --------- Check -------------
	const { localStorageManager } = useStore()

	useEffect(() => {
		if (pin.isValid) {
			;(async () => {
				const isConfirm = (await localStorageManager.verifyPin(pin.value)) || disableVerification
				setConfirm(isConfirm)
				if (isConfirm) {
					setErrorCount(0)
				} else {
					setErrorCount((v) => v + 1)
				}
			})()
		} else {
			setConfirm(null)
		}
	}, [pin.isValid])
	// ----------- Confirm ----------
	useEffect(() => {
		if (isConfirm) {
			const token = setTimeout(() => {
				callback(pin.value)
				goBack()
			}, 1000)
			return () => clearTimeout(token)
		}
	}, [isConfirm])

	useEffect(() => {
		const handler = BackHandler.addEventListener("hardwareBackPress", () => {
			callback()
			goBack()
			return true
		})
		return () => handler.remove()
	}, [goBack])

	// ---------- Block -----------

	useEffect(() => {
		if (countError === errorMax) {
			settings.blockApp(moment().add(30, "second").toDate())
			setErrorCount(0)
		}
	}, [countError])

	// ---------- Anim Error------------

	const rotation = useSharedValue(1)

	const startAnim = () => {
		rotation.value = withSequence(
			// deviate left to start from -ANGLE
			withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
			// wobble between -ANGLE and ANGLE 7 times
			withRepeat(
				withTiming(ANGLE, {
					duration: TIME,
					easing: EASING,
				}),
				3,
				true,
			),
			// go back to 0 at the end
			withTiming(0, { duration: TIME / 2, easing: EASING }),
		)
	}

	useEffect(() => {
		isError && startAnim()
	}, [isError])

	const animErrorStyle = useAnimatedStyle(() => ({
		transform: [{ rotateY: `${rotation.value}deg` }],
	}))

	const numpad = useMemo(
		() => Pin.getKeyboard({ random: isRandomKeyboard }),
		[route.params.isRandomKeyboard],
	)

	const insets = useSafeAreaInsets()

	return (
		<>
			<StatusBar style="light" />

			<Header />
			<View style={styles.container}>
				{!isConfirm && !settings.isAppBlock && (
					<View style={styles.wrapper}>
						<Title text={title} style={styles.title} />
						<Caption style={styles.caption}>
							This is the only way you will be able to {"\n"}
							recover your account. Please store it {"\n"}
							somewhere safe!
						</Caption>

						<Animated.View style={[animErrorStyle, styles.pin]}>
							<PinCode
								isError={isError}
								isHidden={route.params.isHiddenCode}
								value={pin.value}
								style={styles.pin}
							/>
						</Animated.View>

						<Numpad
							onPressRemove={pin.remove}
							onPress={pin.push}
							style={styles.numpad}
							numpad={numpad}
						/>
					</View>
				)}
				{isConfirm && !settings.isAppBlock && (
					<View style={styles.confirm}>
						<StepSuccess
							title="Operation Confirmed"
							caption={`Congratulations,${"\n"} Operation successfully confirmed.`}
						/>
					</View>
				)}
				{settings.isAppBlock && (
					<>
						<StepLock timer={settings.blockingTimer} style={styles.lock} />
						<View style={[styles.buttonBackContainer, { bottom: insets.bottom }]}>
							<Button
								text="Back to homescreen"
								mode="fill"
								disable={settings.blockingTimer.isActive}
								onPress={goBack}
								Right={<Icon2 name="chevron_right_2" stroke={COLOR.White} size={18} />}
							/>
						</View>
					</>
				)}
			</View>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		flex: 1,
	},
	wrapper: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
		flex: 1,
	},
	confirm: {
		justifyContent: "space-evenly",
		flex: 1,
	},
	// ------ Text -------
	title: {
		marginTop: vs(50),
		textAlign: "left",
	},
	caption: {
		marginTop: vs(8),
		color: COLOR.Marengo,
		textAlign: "left",
	},
	// ------- Pin Code -------
	pin: { flex: 2 },
	numpad: {
		flex: 5,
		marginHorizontal: 15,
		justifyContent: "space-between",
		marginBottom: 30,
	},
	// ------------ Block -----------
	buttonBackContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		width: "100%",
	},
	lock: { marginTop: vs(25) },
})
