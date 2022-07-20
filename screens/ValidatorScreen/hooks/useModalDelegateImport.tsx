import { useCallback, useMemo } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { useDimensions } from "@react-native-community/hooks"
import { makeAutoObservable, reaction } from "mobx"
import { Coin, Phrase, Steps } from "classes"
import { useGlobalBottomsheet } from "hooks"
import { COLOR } from "utils"
import { IPerson } from "classes/types"
import { useNavigation } from "@react-navigation/native"
import { BottomSheetHeader, Numpad, Pagination } from "components/moleculs"
import { observer } from "mobx-react-lite"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button } from "components/atoms"

class Controller {
	steps = new Steps(["Delegate Import", "Delegate to", "Delegate Recap"])

	coin: Coin | null = null
	amount: string = "" // usd

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setAmount(amount: string) {
		this.amount = amount
	}
	setMax() {
		if (this.coin?.balanceUSD) {
			this.amount = this.coin.balanceUSD.toString()
		}
	}
}

export default function useModalDelegateImport() {
	const gbs = useGlobalBottomsheet()
	const navigation = useNavigation()

	const close = useCallback(() => gbs.close(), [])

	const steps = useMemo(() => new Steps(["Delegate Import", "Delegate to", "Delegate Recap"]), [])

	const insets = useSafeAreaInsets()

	const open = useCallback(() => {
		gbs.setProps({
			snapPoints: [600],
			bottomInset: insets.bottom,

			children: () => <Component steps={steps} />,
		})
		gbs.snapToIndex(0)
	}, [])

	return [open, close] as const
}

type Props = {
	steps: Steps
}

const Component = observer<Props>(({ steps }) => (
	<View style={styles.container}>
		<BottomSheetHeader
			title="Delegate Import"
			subtitle="Insert BTSG"
			Pagination={<Pagination acitveIndex={steps.active} count={3} />}
		/>

		<View style={styles.row}>
			<Text style={[styles.usd, theme.text.primary]}>
				10000000 $
				{/* {(inverted ? controller.balance : creater.amount) || 0}{" "}
				{inverted ? creater.coin?.info.coinName : "$"} */}
			</Text>
			<View>
				<Button
					text="MAX"
					// onPress={creater.setMax}
					contentContainerStyle={styles.maxButtonContent}
				/>
			</View>
		</View>

		<Numpad style={styles.numpad} />
	</View>
))

const styles = StyleSheet.create({
	background: {
		backgroundColor: COLOR.Dark3,
		paddingTop: 30,
	},

	container: {
		paddingHorizontal: 30,
		flex: 1,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 24,
	},
	usd: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
		backgroundColor: COLOR.White,
	},
	numpad: {
		flexGrow: 1,
		justifyContent: "space-around",
		padding: 15,
	},

	maxButtonContent: {
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
})
