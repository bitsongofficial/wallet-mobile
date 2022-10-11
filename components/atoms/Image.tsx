import { Image, ImageStyle, ImageURISource, StyleProp } from "react-native";
import { useMemo } from "react";

type Props = {
	uri: string,
	style?: StyleProp<ImageStyle>
}

export default ({ uri, style }:  Props) => {
	const source: ImageURISource = useMemo(() => ({ uri }), [uri])
	return (
		<Image source={source} style={style} />
	)
}
