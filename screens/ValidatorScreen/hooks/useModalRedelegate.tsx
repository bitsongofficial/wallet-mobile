import { useCallback, useMemo } from "react"
import { makeAutoObservable, reaction } from "mobx"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Coin, Steps } from "classes"
import { useGlobalBottomsheet } from "hooks"
import { FooterDelegate } from "../components/organisms"
import { Delegate } from "../components/template"

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

	const goBack = useCallback(
		() => (steps.active > 0 ? steps.prev() : gbs.close()),
		[navigation, steps.active],
	)

	const open = useCallback(async () => {
		await gbs.setProps({
			snapPoints: [600],
			onClose: reaction(
				() => steps.active,
				(index) => {
					switch (index) {
						case 0:
							return gbs.updProps({ snapPoints: [600] })
						case 1:
							return gbs.updProps({ snapPoints: ["85%"] })
						case 2:
							return gbs.updProps({ snapPoints: [450] })

						default:
							break
					}
				},
			),
			footerComponent: () => (
				<FooterDelegate
					onPressDone={() => {}}
					style={{ bottom: insets.bottom, marginBottom: 8 }}
					onPressBack={goBack}
					steps={steps}
				/>
			),
			children: () => <Delegate steps={steps} />,
		})
		gbs.snapToIndex(0)
	}, [])

	return [open, close] as const
}
