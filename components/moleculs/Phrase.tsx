import { memo } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Word } from "components/atoms"
import { sliceIntoChunks } from "utils"
import { s } from "react-native-size-matters"

type Props = {
	value: string[]
	hidden?: boolean
	style?: StyleProp<ViewStyle>
	wordStyle?: StyleProp<ViewStyle>
	hiddenStyle? : StyleProp<ViewStyle>
}

export default memo(({ value, style, wordStyle, hiddenStyle, hidden = true }: Props) => (
	<View style={style}>
		{sliceIntoChunks(value, 2).map(([first, second], index) => (
			<View key={index} style={styles.container}>
				<Word hidden={hidden} index={index * 2 + 1} text={first} hiddenStyle={hiddenStyle} style={[styles.word, wordStyle]} />
				{second && <Word hidden={hidden} index={index * 2 + 2} text={second} hiddenStyle={hiddenStyle}  style={[wordStyle]} />}
			</View>
		))}
	</View>
))

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginBottom: s(10),
	},
	word: {
		marginRight: s(10),
	},
})
