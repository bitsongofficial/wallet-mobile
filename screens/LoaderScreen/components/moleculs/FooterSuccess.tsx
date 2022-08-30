import { View } from "react-native"
import Animated, { StyleProps } from "react-native-reanimated"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Button } from "../atoms"

type FooterProps = {
	style: StyleProps
	onPressConfirm?(): void
	onPressMintscan?(): void
}

export default ({ style, onPressConfirm, onPressMintscan }: FooterProps) => (
	<Animated.View style={style}>
		<Button text="Confirm" onPress={onPressConfirm} />
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Button
				text="View on Mintscan"
				mode="fill"
				onPress={onPressMintscan}
				Right={<Icon2 name="chevron_right" stroke={COLOR.White} size={18} />}
			/>
		</View>
	</Animated.View>
)
