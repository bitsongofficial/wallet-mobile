import { View } from "react-native"
import Animated, { StyleProps } from "react-native-reanimated"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Button } from "../atoms"
import { useTranslation } from "react-i18next"

type FooterProps = {
	style: StyleProps
	onPressConfirm?(): void
	onPressMintscan?(): void
}

export default ({ style, onPressConfirm, onPressMintscan }: FooterProps) =>
{
	const { t } = useTranslation()
	return  (
		<Animated.View style={style}>
			<Button text={t("Confirm")} textAlignment="center" onPress={onPressConfirm} />
			{onPressMintscan && <View style={{ justifyContent: "center", alignItems: "center" }}>
				<Button
					text={t("ViewOnMintscan")}
					mode="fill"
					onPress={onPressMintscan}
					Right={<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />}
				/>
			</View>}
		</Animated.View>
	)
}
