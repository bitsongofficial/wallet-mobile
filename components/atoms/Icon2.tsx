import { memo } from "react"
import { StyleSheet, View } from "react-native"
import { SvgCss, XmlProps } from "react-native-svg"
import { s } from "react-native-size-matters"
import Icons from "assets/svg2/icons"
import { COLOR } from "utils"

export type IconName = keyof typeof Icons

type Props = Omit<XmlProps, "xml" | "fill"> & {
	size?: number
	fill?: string
	name: IconName
}

export default memo(({ size = 14, name, ...props }: Props) => {
	const style = {
		width: props.style?.width || s(size),
		height: props.style?.height || s(size),
	}

	const Icon = Icons[name]

	if (Icon) {
		return <SvgCss {...props} {...style} xml={Icon} style={[style, props.style]} />
	}
	return <View style={[styles.fake, style, props.style]} />
})

const styles = StyleSheet.create({
	fake: {
		backgroundColor: COLOR.White,
	},
})
