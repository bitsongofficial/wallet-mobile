import { Paragraph, Title } from "components/atoms"
import {
	StyleProp,
	StyleSheet, View, ViewStyle,
} from "react-native"
import { s } from "react-native-size-matters"

type Props = {
	title: string
	text?: string
	style?: StyleProp<ViewStyle>
	paragraphStyle?: StyleProp<ViewStyle>
}

export default ({ title, text, style, paragraphStyle, children }: React.PropsWithChildren<Props>) => {
	return (
		<View style={style}>
			<Title title={title} style={styles.title} size={20} />
			<Paragraph style={paragraphStyle} text={text}>{children}</Paragraph>
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		marginBottom: s(8)
	}
})
