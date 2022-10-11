import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Icon2 } from "components/atoms"
import { ToolbarAction } from "components/organisms"
import { observer } from "mobx-react-lite"
import { COLOR } from "utils"
import { useTranslation } from "react-i18next"

type Props = {
	onPressSend?(): void
	onPressReceive?(): void
	onPressInquire?(): void
	onPressScan?(): void
	onPressAll?(): void
	style: StyleProp<ViewStyle>
}

export default observer(function ToolbarShort({
	onPressSend,
	onPressReceive,
	onPressInquire,
	onPressScan,
	onPressAll,
	style,
}: Props) {
	const { t } = useTranslation()
	return (
		<View style={[styles.container, style]}>
			<ToolbarAction
				title={t("Send")}
				onPress={onPressSend}
				mode="gradient"
				Icon={<Icon2 stroke={COLOR.White} size={18} name="arrow_up" />}
			/>
			<ToolbarAction
				title={t("Receive")}
				onPress={onPressReceive}
				Icon={<Icon2 stroke={COLOR.White} size={18} name="arrow_down" />}
			/>
			<ToolbarAction
				title={t("Inquire")}
				onPress={onPressInquire}
				Icon={<Icon2 stroke={COLOR.White} size={18} name="inquire" />}
			/>
			<ToolbarAction
				title={t("Scan")}
				onPress={onPressScan}
				Icon={<Icon2 stroke={COLOR.White} size={18} name="scan" />}
			/>
			{/* <ToolbarAction
				title={t("All")}
				onPress={onPressAll}
				mode="outline"
				Icon={<Icon2 stroke={COLOR.White} size={18} name="settings" />}
			/> */}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
})
