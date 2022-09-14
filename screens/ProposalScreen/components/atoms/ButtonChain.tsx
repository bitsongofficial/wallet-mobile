import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { s } from "react-native-size-matters"

type Props = {
	logo?: string
	style?: StyleProp<ViewStyle>
	onPress(): void
}

export default ({ logo, style, onPress }: Props) => (
	<TouchableOpacity style={[styles.container, style]} onPress={onPress}>
		<Image style={styles.image} source={require("assets/images/mock/logo_bitsong.png")} />
		<Icon2 name="chevron_down" size={18} stroke={COLOR.White} />
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	container: {
		borderWidth: s(2),
		borderColor: COLOR.Dark2,
		paddingHorizontal: s(15),
		paddingVertical: s(10),
		borderRadius: s(50),

		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	image: {
		width: s(24),
		height: s(24),
		marginRight: s(13),
	},
})
