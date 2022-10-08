import { RadioButton } from "components/atoms"
import { StyleSheet, Text, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR, hexAlpha } from "utils"

export type Props<T> = {
	item: T
	isActive: boolean
	hideSelector?: boolean
	labelExtractor?:(item: T) => string
	leftExtractor?:(item: T) => JSX.Element
	rightExtractor?:(item: T) => JSX.Element
}

export default function SelectItem<T> ({
	item,
	isActive,
	hideSelector = false,
	leftExtractor,
	rightExtractor,
	labelExtractor
}: Props<T>)
{
	return (
		<View style={[styles.container]}>
			<View style={[styles.content, hideSelector ? styles.contentWithoutSelector : styles.contentWithSelector]}>
				<View style={styles.row}>
					{leftExtractor && leftExtractor(item)}
					<Text style={[styles.title, (isActive || hideSelector) && styles.text_active]}>
						{labelExtractor ? labelExtractor(item) : item?.toString()}
					</Text>
				</View>
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
	row: {
		flexDirection: "row",
		alignItems: "center",
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
