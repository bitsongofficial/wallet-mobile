import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button } from "components/atoms"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { Avatar, Title } from "../atoms"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import { useStore } from "hooks"
import { useCallback, useEffect, useRef, useState } from "react"
import { reaction } from "mobx"
import { useSpring } from "@react-spring/native"
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated"
import { s } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type Props = {
	style: StyleProp<ViewStyle>
	input: InputHandler
	onPressAvatar?(): void
	avatar?: string
	onNickEdited?(): void
}

export default observer<Props>(
	({ style, input, onPressAvatar, avatar, onNickEdited }) => {
		const { t } = useTranslation()
		const inputRef = useRef<TextInput>(null)
		const { dapp, wallet } = useStore()

		const openInput = useCallback(() => {
			inputRef.current?.focus()
		}, [])

		const [isNickValid, setIsNickValid] = useState(false)
		// TODO: need debouncer
		const checkNick = async (value: string) => setIsNickValid(await dapp.checkNick(value))

		useEffect(() => reaction(() => input.value, checkNick), [input])
		useEffect(() => {
			if (!input.isFocused && isNickValid && wallet.activeProfile) {
				wallet.changeActiveProfileName(input.value)
			}
		}, [input.isFocused, isNickValid, wallet.activeProfile, input])

		const hidden = useSpring({ opacity: input.isFocused ? 0.3 : 1 })


		return (
			<View style={[styles.container, style]}>
				<View style={styles.user}>
					<TouchableOpacity onPress={onPressAvatar}>
						<Avatar style={styles.avatar} source={avatar ? { uri: avatar } : undefined} />
					</TouchableOpacity>
					<View style={{ flexDirection: "row" }} onPress={openInput}>
						<View style={styles.row}>
							<Title style={hidden}>{input.value || input.isFocused ? `@` : "Profile"}</Title>
							<TextInput
								// editable={editable}
								ref={inputRef}
								style={styles.input}
								value={input.value}
								onChangeText={input.set}
								enabled={false}
								onFocus={input.focusON}
								onBlur={input.focusOFF}
								focusable={false}
								onEndEditing={onNickEdited}
							/>
						</View>
					</View>
				</View>
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	row: {
		flexDirection: "row"
	},
	user: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		marginRight: s(18),
	},
	input: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(28),
		lineHeight: s(35),
		color: COLOR.White,
	},

	button: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
	},
	buttonContent: {
		paddingHorizontal: s(18),
		paddingVertical: s(9),
	},
	buttonText: {
		fontSize: s(14),
		lineHeight: s(18),
	},
})
