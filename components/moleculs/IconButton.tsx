import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"
import { useTheme } from "hooks"
import { s } from "react-native-size-matters"
import Icons from "assets/svg";
import { Icon } from "components/atoms";

type Props = {
	onPress?(): void
	style?: StyleProp<ViewStyle>
	size?: number;
	fill?: string;
	name: keyof typeof Icons;
}

export default ({ onPress, style, name, size, fill }: Props) => {
	const theme = useTheme()

	return (
		<View style={[style]}>
			<TouchableOpacity onPress={onPress}>
				<Icon name={name} size={size} fill={fill}></Icon>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	inner: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		marginLeft: s(4),
	},
})
