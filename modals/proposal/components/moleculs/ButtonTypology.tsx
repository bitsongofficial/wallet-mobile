import { useMemo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon2, IconName, ThemedGradient } from "components/atoms"
import { COLOR, hexAlpha } from "utils"

export type VoteTypology = "text"

type ButtonProps = {
	typology: VoteTypology
	active: VoteTypology
	onPress(typology: VoteTypology): void
	style?: StyleProp<ViewStyle>
}

export default ({ onPress, style, typology, active }: ButtonProps) => {
	const isActive = active === typology
	const Background = isActive ? ThemedGradient : View

	const title = useMemo(
		() => (typology === "text" ? "Text Proposal" : "Software Update"),
		[typology],
	)
	const caption = useMemo(
		() =>
			typology === "text"
				? `Increase the minimum commission${"\n"}validato driving commissions down.`
				: `Increase the minimum commission${"\n"}alida driving commissions down.`,
		[typology],
	)

	const icon = useMemo<IconName>(
		() =>
			typology === "text"
				? isActive
					? "XCircle_gradient"
					: "XCircle"
				: isActive
				? "MinusCircle_gradient"
				: "MinusCircle",
		[typology, isActive],
	)

	return (
		<TouchableOpacity onPress={() => onPress(typology)}>
			<View style={[styles.container, style]}>
				<Background style={isActive && styles.border}>
					<View style={[styles.content, isActive && styles.content_active]}>
						<Icon2 name={icon} size={24} stroke={COLOR.White} style={{ marginRight: 20 }} />
						<View>
							<Text style={[styles.title]}>{title}</Text>
							<Text style={[styles.caption]}>{caption}</Text>
						</View>
					</View>
				</Background>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		overflow: "hidden",
	},
	content: {
		paddingVertical: 19,
		paddingHorizontal: 22,
		flexDirection: "row",
		borderRadius: 18,
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
	},
	content_active: {
		backgroundColor: COLOR.Dark2,
	},
	border: {
		padding: 2,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,

		marginBottom: 7,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 15,
		color: hexAlpha(COLOR.White, 50),
	},
})
