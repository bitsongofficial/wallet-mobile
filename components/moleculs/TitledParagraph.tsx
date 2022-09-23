import { Paragraph, Title } from "components/atoms"
import {
	StyleSheet,
} from "react-native"
import { s } from "react-native-size-matters"

type Props = {
	title: string
	text?: string
}

export default ({ title, text, children }: React.PropsWithChildren<Props>) => {
	return (
		<>
			<Title title={title} style={styles.title} size={20} />
			<Paragraph text={text}>{children}</Paragraph>
		</>
	)
}

const styles = StyleSheet.create({
	title: {
		marginBottom: s(8)
	}
})
