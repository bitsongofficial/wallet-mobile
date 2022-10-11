import { Box, Icon, Icon2, Title } from "components/atoms"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type Props = {
	title: string
	style?: StyleProp<ViewStyle>
	icon?: typeof Icon | typeof Icon2
	iconLeft?: typeof Icon | typeof Icon2
	subtitle?: string
	onPress?:() => void
}

export default ({title, subtitle, icon, iconLeft, onPress, children, style}: React.PropsWithChildren<Props>) =>
{
	const inner = 
		<Box style={[styles.container, style]}>
			<View style={styles.topPart}>
				<>
					{iconLeft}
					<Title title={title} titleStyle={styles.title} subtitle={subtitle}></Title>
					{icon}
				</>
			</View>
			<View>
				{children}
			</View>
		</Box>
	if(onPress) return (
		<TouchableOpacity onPress={onPress}>
			{inner}
		</TouchableOpacity>
	)
	return inner
}

const styles = StyleSheet.create({
	title: {
		color: COLOR.RoyalBlue2,
		marginBottom: s(12),
	},
	topPart: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	container: {
		flexDirection: "column",
	},
})