import { StyleSheet, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { ToolbarAction } from "components/organisms"
import { Icon2 } from "components/atoms"
import { StyleProp } from "react-native"
import Title from "./Title"

type ToolbarProps = {
	onPressClaim?(): void
	onPressStake?(): void
	onPressUnstake?(): void
	onPressRestake?(): void
	style?: StyleProp<ViewStyle>
}

export default ({
	onPressClaim,
	onPressRestake,
	onPressStake,
	onPressUnstake,
	style,
}: ToolbarProps) => {
	return (
		<View style={style}>
			<Title>Quick actions</Title>
			<View style={styles.row}>
				<ToolbarAction
					onPress={onPressClaim}
					title="Claim"
					mode="gradient"
					Icon={<Icon2 size={18} stroke={COLOR.White} name="arrow_down" />}
					size={65}
				/>
				<ToolbarAction
					backgroundStyle={styles.actionBackground}
					title="Stake"
					onPress={onPressStake}
					Icon={<Icon2 size={18} stroke={COLOR.White} name="stake" />}
					size={65}
				/>
				<ToolbarAction
					onPress={onPressUnstake}
					backgroundStyle={styles.actionBackground}
					title="Unstake"
					Icon={<Icon2 size={18} stroke={COLOR.White} name="unstake" />}
					size={65}
				/>
				<ToolbarAction
					backgroundStyle={styles.actionBackground}
					title="Restake"
					onPress={onPressRestake}
					Icon={<Icon2 size={18} stroke={COLOR.White} name="restake" />}
					size={65}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 38,
	},

	actionBackground: {
		backgroundColor: COLOR.Dark3,
	},
})
