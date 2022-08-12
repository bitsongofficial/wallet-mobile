import { useCallback } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { MockChain } from "stores/MainStore"

type Props = {
	chain: MockChain
	style?: StyleProp<ViewStyle>
	onPress(chain: MockChain): void
}

export default ({ chain, style, onPress }: Props) => (
	<RectButton style={style} onPress={useCallback(() => onPress(chain), [chain])}>
		<View style={styles.container}>
			<View style={styles.avatar} />
			<View style={styles.data}>
				<Text style={styles.tokenName}>{chain.tokenName}</Text>
				<Text style={styles.name}>{chain.name}</Text>
			</View>
		</View>
	</RectButton>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 16,
	},
	avatar: {
		width: 24,
		height: 24,
		borderRadius: 24,
		backgroundColor: COLOR.Dark3,
		marginRight: 24,
	},
	data: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	tokenName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
	},
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.RoyalBlue,
	},
})
