import { Icon2 } from "components/atoms"
import { ToolbarAction } from "components/organisms"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Caption, Card, Count } from "../atoms"

type Props = {
	style?: StyleProp<ViewStyle>
	onPressStake(): void
	onPressUnstake(): void
	onPressRestake(): void
}

export default ({ style, onPressRestake, onPressStake, onPressUnstake }: Props) => {
	return (
		<Card style={[styles.container, style]}>
			<View style={styles.head}>
				<Caption style={styles.caption}>MY DELEGATION</Caption>
				<Count value="7,268.78" coinName="BTSG" />
			</View>
			<View style={styles.row}>
				<ToolbarAction
					backgroundStyle={styles.action}
					textStyle={styles.text}
					title="Stake"
					onPress={onPressStake}
					Icon={<Icon2 size={18} name="stake_gradient" />}
					size={65}
				/>
				<ToolbarAction
					backgroundStyle={styles.action}
					textStyle={styles.text}
					title="Unstake"
					onPress={onPressUnstake}
					Icon={<Icon2 size={18} name="unstake_gradient" />}
					size={65}
				/>
				<ToolbarAction
					backgroundStyle={styles.action}
					textStyle={styles.text}
					title="Restake"
					onPress={onPressRestake}
					Icon={<Icon2 size={18} name="restake_gradient" />}
					size={65}
				/>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 21,
		paddingRight: 25,
		paddingVertical: 24,
	},

	head: {
		marginBottom: 24,
	},

	caption: {
		marginBottom: 13,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	action: {
		backgroundColor: COLOR.Dark3,
	},
	text: {
		fontSize: 14,
		lineHeight: 18,
	},
})