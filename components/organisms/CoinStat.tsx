import { Image, ImageURISource, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR, hexAlpha } from "utils"
import Coin from "classes/Coin"
import { observer } from "mobx-react-lite"
import { assets } from "chain-registry"
import { useStore } from "hooks"
import { toJS } from "mobx"
import { s } from "react-native-size-matters"
import ListItem from "components/moleculs/ListItem"
import { formatNumber } from "utils/numbers"

type Props = {
	coin: Coin
	style?: StyleProp<ViewStyle>
}

export default observer(({ coin, style }: Props) => {
	const { settings, coin: cs } = useStore()
	const asset = assets
		.reduce((res: any[], a: any) => res.concat(a.assets), [])
		.find((a: any) => a.base === coin.info.denom)
	const logo = asset && asset.logo_URIs && asset.logo_URIs.png ? asset.logo_URIs.png : undefined
	const name = asset ? asset.name.replace("Fantoken", "") : "undefined"
	const display = asset ? asset.display.toUpperCase() : "Undefined"
	const balance = coin.balance.toLocaleString("en")
	const balanceFIAT = cs.fromCoinToFiat(coin)

	return (
		<ListItem
			uri={logo}
			title={name}
			subtitle={display}
			description={balance}
			subdescription={balanceFIAT ? (formatNumber(balanceFIAT) + " " + settings.prettyCurrency?.symbol) : undefined}
			style={style}
		/>
	)
})