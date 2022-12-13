import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Input } from "components/atoms"
import { COLOR, InputHandler } from "utils"
import { CardWillSend } from "components/moleculs"
import { observer } from "mobx-react-lite"
import { ICoin } from "classes/types"
import { Asset } from "stores/models/Asset"
import { Chain } from "stores/models/Chain"

type Props = {
	asset: Asset | null
	chain?: Chain
	amount: string
	address: string

	onPress(): void
	style?: StyleProp<ViewStyle>
	memoInput: InputHandler
	/** if use in bottomsheet */
	bottomSheet?: boolean
}

export default observer(function Recap({
	address,
	amount,
	asset,
	chain,
	onPress,

	style,
	memoInput,
	bottomSheet,
}: Props) {
	return (
		<View style={[styles.container, style]}>
			<CardWillSend address={address} amount={amount} asset={asset} chain={chain} onPressUp={onPress} />

			<Input
				bottomsheet={bottomSheet}
				placeholder="Add memo"
				value={memoInput.value}
				onChangeText={memoInput.set}
				onFocus={memoInput.focusON}
				onBlur={memoInput.focusOFF}
				style={styles.inputContainer}
				inputStyle={styles.inputStyle}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {},
	inputContainer: {
		backgroundColor: COLOR.Dark3,
		marginTop: 24,
		borderRadius: 20,
	},
	inputStyle: {
    height: 62
  },
})
