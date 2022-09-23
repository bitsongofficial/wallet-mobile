import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
} from "react-native"
import { COLOR } from "utils"
import { rehydrateNewLines } from "utils/string"

type Props = {
	text?: string
	style?: StyleProp<TextStyle>
}

export default ({ text, children, style }: React.PropsWithChildren<Props>) => {
	return (
		<Text style={[styles.caption, style]}>
          {text && rehydrateNewLines(text)}
		  {children}
        </Text>
	)
}

const styles = StyleSheet.create({
	caption: {
	  fontFamily: "CircularStd",
	  fontStyle: "normal",
	  fontWeight: "500",
	  fontSize: 14,
	  lineHeight: 18,
	  color: COLOR.Marengo,
	  marginBottom: 26,
	},
})
