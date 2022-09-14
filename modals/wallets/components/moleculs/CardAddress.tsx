import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Icon2, Input } from "components/atoms"
import { useTheme } from "hooks"
import { TouchableOpacity } from "react-native-gesture-handler"
import { COLOR, InputHandler } from "utils"
import { useMemo } from "react"
import { trimAddress } from "utils/string"

type Props = {
	input: InputHandler
	onPressQR(): void
	style?: StyleProp<ViewStyle>
	isError?: boolean
}

export default observer<Props>(function CardWallet({ onPressQR, input, style, isError }: Props) {
	const theme = useTheme()

	const value = useMemo(() => {
		const text = input.value
		if (input.isFocused || text.length < 25) return text
		return trimAddress(text)
	}, [input.isFocused, input.value])

	return (
		<Input
			bottomsheet
			style={[theme.text.primary, styles.container, style]}
			inputStyle={styles.input}
			placeholder="Public Address"
			onChangeText={input.set}
			onFocus={input.focusON}
			onBlur={input.focusOFF}
			placeholderTextColor={theme.input.placeholder}
			value={value}
			errorMessage={isError && "Invalid address"}
			errorStyle={styles.error}
			Right={
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={onPressQR} style={styles.touchable}>
						<Icon2 name="scan" stroke={COLOR.RoyalBlue} size={18} />
					</TouchableOpacity>
				</View>
			}
		/>
	)
})

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		borderRadius: 20,
	},
	input: { height: 70 },
	error: { left: 0 },
	touchable: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 40,
		padding: 26,
	},
	buttonContainer: { justifyContent: "center" },
})