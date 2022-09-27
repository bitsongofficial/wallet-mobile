import { ImageURISource, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { s } from "react-native-size-matters"
import { Image } from "components/atoms"

type Props = {
	style?: StyleProp<ViewStyle>
	title: string
	subtitle?: string
	uri?: string
	description?: string
	subdescription?: string
}

export default ({ style, title, subtitle, description, subdescription, uri }: Props) => {
	return (
		<View style={[styles.container, style]}>
			{uri != undefined && <View style={styles.imageContainer}>
				<Image uri={uri} style={styles.image}></Image>
			</View>}

			<View style={styles.about}>
				<View style={styles.texts}>
					<Text style={styles.primary}>{title}</Text>
					{subtitle != undefined && <Text style={styles.secondary}>{subtitle}</Text>}
				</View>

				{(description != undefined || subdescription != undefined) && <View style={styles.numbers}>
					<Text style={styles.primary}>{description}</Text>
					{subdescription != undefined && (
						<Text style={styles.secondary}>
							{subdescription}
						</Text>
					)}
				</View>}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: hexAlpha(COLOR.White, 10),
		height: s(70),
		paddingHorizontal: s(20),
		paddingVertical: s(18),
		borderRadius: s(20),
		flex: 1,
		flexDirection: "row",
	},

	about: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	imageContainer: {
		marginRight: s(14),
		width: s(30),
		height: s(30),
	},
	image: {
		width: s(30),
		height: s(30),
		borderRadius: s(30),
		backgroundColor: COLOR.Dark3,
	},
	texts: {
		flex: 1,
		alignItems: "flex-start",
	},
	numbers: {
		flex: 1,
		alignItems: "flex-end",
	},
	primary: {
		color: COLOR.White,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
	},
	secondary: {
		color: COLOR.White,
		opacity: 0.5,
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		// lineHeight: '111.1%',
	},
})
