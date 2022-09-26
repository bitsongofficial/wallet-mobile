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
}

export default ({ title, text, style, children }: React.PropsWithChildren<Props>) => {
	return (
		<View style={style}>
			<Title title={title} style={styles.title} size={20} />
			<Paragraph text={text}>{children}</Paragraph>
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		marginBottom: s(8)
	}
})
