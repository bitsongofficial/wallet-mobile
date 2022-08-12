import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

type Props = {
	logo?: string
	style?: StyleProp<ViewStyle>
	onPress(): void
}

export default ({ logo, style, onPress }: Props) => {
	return (
		<TouchableOpacity style={[styles.container, style]} onPress={onPress}>
			<Image
				style={{ width: 24, height: 24, marginRight: 13 }}
				source={require("assets/images/mock/logo_bitsong.png")}
				// source={{ uri: logo }}
			/>
			<Icon2 name="chevron_down" size={18} stroke={COLOR.White} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 2,
		borderColor: COLOR.Dark2,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 50,

		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	image: { width: 24, height: 24, marginRight: 13 },
})
