import {
	ImageStyle,
	StyleProp,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"
import { useTheme } from "hooks"
import { Image } from "components/atoms";

type Props = {
	onPress?(): void
	style?: StyleProp<ViewStyle>
	imageStyle?: StyleProp<ImageStyle>
	uri: string
}

export default ({ onPress, style, imageStyle, uri }: Props) => {
	const theme = useTheme()

	return (
		<View style={[style]}>
			<TouchableOpacity onPress={onPress}>
				<Image uri={uri} style={imageStyle}></Image>
			</TouchableOpacity>
		</View>
	)
}