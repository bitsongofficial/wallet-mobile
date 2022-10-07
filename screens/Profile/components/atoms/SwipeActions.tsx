import { memo } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { Button, Icon2 } from "components/atoms"
import { COLOR, hexAlpha } from "utils"
import { s } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type Props = {
	item: any
	onPressEdit?(item: any): void
	onPressTrash(item: any): void
	style?: StyleProp<ViewStyle>
	edited?: boolean
}

export default memo(({ onPressEdit, onPressTrash, item, style, edited = true }: Props) =>
{
	const { t } = useTranslation()

	return (
		<View style={[styles.container, style]}>
			{edited && (
				<Button
					text={t("Edit")}
					mode="fill"
					style={styles.button}
					onPress={() => onPressEdit && onPressEdit(item)}
					contentContainerStyle={styles.buttonContent}
				/>
			)}
			<RectButton onPress={() => onPressTrash(item)}>
				<Icon2 size={24} name="trash" stroke={hexAlpha(COLOR.White, 30)} />
			</RectButton>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		width: s(100),
		flexDirection: "row",
		alignItems: "center",
	},

	button: {
		marginRight: s(15),
	},
	buttonContent: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		paddingHorizontal: s(14),
		paddingVertical: s(8),
	},
})
