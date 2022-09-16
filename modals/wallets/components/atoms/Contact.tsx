import { useMemo } from "react"
import { StyleSheet, Text, View, ViewStyle, StyleProp } from "react-native"
import { Contact } from "stores/ContactsStore"
import { COLOR } from "utils"
import { useTheme } from "hooks"
import { Icon2, ThemedGradient } from "components/atoms"

type Props = {
	user: Contact
	style?: StyleProp<ViewStyle>
	isActive?: boolean
}

export default function User({ user, style, isActive }: Props) {
	const theme = useTheme()

	const name = useMemo(
		() => (user.name.length > 8 ? user.name.substring(0, 8) + "..." : user.name),
		[user.name],
	)

	const Container = isActive ? ThemedGradient : View

	return (
		<View style={[styles.container, style]}>
			<Container style={styles.avatarContainer}>
				<View style={styles.placeholder} />
				{true && (
					<Icon2
						style={styles.star}
						name="star_2"
						fill={isActive ? COLOR.White : COLOR.RoyalBlue}
						size={24}
					/>
				)}
			</Container>

			<Container style={styles.nameContaner}>
				<Text style={[styles.name, theme.text.primary]}>{name}</Text>
			</Container>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	avatarContainer: {
		width: 74,
		height: 74,
		borderRadius: 74,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholder: {
		width: 62,
		height: 62,
		borderRadius: 62,
		backgroundColor: "grey",
	},

	nameContaner: {
		marginTop: 9,
		paddingVertical: 2,
		paddingHorizontal: 9,
		borderRadius: 50,
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 15,
	},

	star: {
		position: "absolute",
		bottom: 10,
		right: 1,
	},
})
