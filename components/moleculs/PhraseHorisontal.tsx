import { useEffect, useRef } from "react"
import { StyleSheet, ScrollViewProps } from "react-native"
import { Word } from "components/atoms"
import { Phrase } from "classes"
import { ScrollView } from "react-native-gesture-handler"
import { observer } from "mobx-react-lite"

type Props = ScrollViewProps & {
	phrase: Phrase
}

export default observer(({ phrase, ...props }: Props) => {
	const scrollview = useRef<ScrollView>(null)

	useEffect(() => {
		const lastLenght = phrase.words.length

		return () => {
			if (lastLenght < phrase.words.length) {
				scrollview.current?.scrollToEnd() // TODO: fix for full end
			}
		}
	}, [phrase.words.length])

	return (
		<ScrollView
			{...props}
			horizontal
			ref={scrollview}
			keyboardShouldPersistTaps="always"
			style={[styles.scrollview, props.style]}
			contentContainerStyle={[styles.scrollviewContent, props.contentContainerStyle]}
		>
			{phrase.words.map((word, index) => (
				<Word
					isActive={phrase.activeIndex === index}
					onPress={() => phrase.setActiveIndex(index)}
					text={word}
					style={styles.word}
					index={index + 1}
					key={index}
				/>
			))}
		</ScrollView>
	)
})

const styles = StyleSheet.create({
	scrollview: {
		paddingVertical: 5,
		marginBottom: 35,
		flexGrow: 1,
	},
	scrollviewContent: {
		height: 50,
	},
	word: { marginRight: 10 },
})
