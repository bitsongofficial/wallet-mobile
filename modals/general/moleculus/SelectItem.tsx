import { RadioButton } from "components/atoms"
import { StyleSheet, Text, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR, hexAlpha } from "utils"

export type Props = {
	item: any
	isActive: boolean
	hideSelector?: boolean
	labelExtractor?:(item: any) => string
	leftExtractor?:(item: any) => JSX.Element
	rightExtractor?:(item: any) => JSX.Element
}

export default ({
	item,
	isActive,
	hideSelector = false,
	leftExtractor,
	rightExtractor,
	labelExtractor
}: Props) => {
	return (
		<View style={[styles.container]}>
			<View style={[styles.content, hideSelector ? styles.contentWithoutSelector : styles.contentWithSelector]}>
				{leftExtractor && leftExtractor(item)}
				<Text style={[styles.title, (isActive || hideSelector) && styles.text_active]}>
					{labelExtractor ? labelExtractor(item) : item.toString()}
				</Text>
				{rightExtractor && rightExtractor(item)}
			</View>
			{!hideSelector && <RadioButton isActive={isActive} />}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 4,
		paddingLeft: s(8),
		paddingRight: s(8),
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		height: vs(55),
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(13),
		lineHeight: s(50),
		color: COLOR.RoyalBlue3,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: s(15),
		lineHeight: s(50),
		color: hexAlpha(COLOR.White, 40),
	},
	text_active: {
		color: COLOR.White,
	},
	content: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},
	contentWithSelector: {
		marginEnd: s(20),
	},
	contentWithoutSelector: {
	},
})
