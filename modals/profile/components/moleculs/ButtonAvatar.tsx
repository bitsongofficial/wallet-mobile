import { useCallback } from "react"
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import * as ImagePicker from "expo-image-picker"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import { s } from "react-native-size-matters"

type Props = {
	source: ImageSourcePropType | undefined | null
	onChange(uri: string): void
}

export default ({ source, onChange }: Props) => {
	const pickImage = useCallback(async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.cancelled) {
			onChange(result.uri)
		}
	}, [])

	return (
		<RectButton onPress={pickImage} style={styles.button}>
			<View style={styles.avatar}>
				{source ? (
					<Image source={source} width={s(107)} height={s(107)} style={styles.image} />
				) : (
					<View style={styles.iconContainer}>
						<Icon2 name="plus" size={33} />
					</View>
				)}
			</View>
		</RectButton>
	)
}

const styles = StyleSheet.create({
	button: {
		width: s(129),
		height: s(129),
		borderRadius: s(129),
	},
	avatar: {
		width: s(129),
		height: s(129),
		borderRadius: s(129),
		backgroundColor: hexAlpha(COLOR.Silver, 5),
		alignItems: "center",
		justifyContent: "center",

		marginBottom: 24,
	},
	image: {
		width: s(107),
		height: s(107),
		borderRadius: s(107),
	},

	iconContainer: {
		width: s(89),
		height: s(89),
		borderRadius: s(89),
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: hexAlpha(COLOR.Silver, 10),
	},
})
