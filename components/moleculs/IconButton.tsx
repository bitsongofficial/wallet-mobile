import {
	StyleProp,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"
import { useTheme } from "hooks"
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