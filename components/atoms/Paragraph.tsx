import {
	StyleSheet,
	Text,
} from "react-native"
import { COLOR } from "utils"
import { rehydrateNewLines } from "utils/string"

type Props = {
	text?: string
}

export default ({ text, children }: React.PropsWithChildren<Props>) => {
	return (
		<Text style={styles.caption}>
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
  
	  textAlign: "center",
	  color: COLOR.Marengo,
	  marginBottom: 26,
	},
})
