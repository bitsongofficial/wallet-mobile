import { useMemo } from "react"
import { StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Numpad } from "components/moleculs"
import { Pin } from "classes"
import { PinCode } from "../moleculs"
import { s } from "react-native-size-matters"

type Props = { pin: Pin }

export default observer(({ pin }: Props) => {
	const numpad = useMemo(() => Pin.getKeyboard({ random: true }), [])
	return (
		<>
			<PinCode value={pin.value} style={styles.pin} />
			<Numpad onPressRemove={pin.remove} onPress={pin.push} style={styles.numpad} numpad={numpad} />
		</>
	)
})

const styles = StyleSheet.create({
	pin: { flex: 2 },
	numpad: {
		marginHorizontal: s(15),
		flex: 5,
		justifyContent: "space-between",
	},
})
