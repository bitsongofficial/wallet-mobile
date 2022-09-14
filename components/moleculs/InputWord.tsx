import { Phrase } from "classes"
import { Input } from "components/atoms"
import { observer } from "mobx-react-lite"
import {
	StyleProp,
	StyleSheet,
	Text,
	TextInputProps,
	TextStyle,
	View,
	ViewStyle,
} from "react-native"
import { COLOR } from "utils"

type Props = TextInputProps & {
	phrase: Phrase
	inputStyle?: StyleProp<TextStyle>
	style?: StyleProp<ViewStyle>
	bottomsheet?: boolean
}

export default observer(({ phrase, style, inputStyle, bottomsheet, ...props }: Props) => {
	return (
		<View style={style}>
			<Text style={styles.label}>Word #{phrase.words.length + 1}</Text>
			<Input
				blurOnSubmit={false}
				bottomsheet={bottomsheet}
				style={inputStyle}
				value={phrase.inputValue}
				onChangeText={phrase.inputSet}
				onSubmitEditing={phrase.inputSubmit}
				keyboardAppearance="dark" // TODO: theme me
				autocomplite={phrase.hint}
				autoCorrect={false}
				autoCapitalize="none"
				autoCompleteType="off"
				autoFocus
				{...props}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {},
	label: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 12,
		lineHeight: 15,
		color: COLOR.Marengo,
		marginBottom: 12,
	},
})
