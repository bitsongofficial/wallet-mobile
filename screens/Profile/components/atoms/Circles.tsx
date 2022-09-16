import { useMemo } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { useLayout } from "@react-native-community/hooks"
import { hexAlpha } from "utils"

type Props = {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
}

export default ({ children, style }: Props) => {
	const { onLayout, height, width } = useLayout()
	const size = useMemo(() => (width > height ? height : width), [width, height])

	return (
		<View style={[styles.container, style]} onLayout={onLayout}>
			<Circle size={size} opacity={0.1}>
				<Circle size={(size * 2) / 3} opacity={0.3}>
					<Circle size={size / 2} opacity={0.5}>
						{children}
					</Circle>
				</Circle>
			</Circle>
		</View>
	)
}

type CircleProps = {
	children: React.ReactNode
	size: number
	opacity?: number
}

const Circle = ({ children, size, opacity = 1 }: CircleProps) => (
	<View
		style={{
			width: size,
			height: size,
			borderRadius: size,
			backgroundColor: hexAlpha("#737ae2", opacity * 100),
			alignItems: "center",
			justifyContent: "center",
		}}
		children={children}
	/>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
})
