import { Image, ImageURISource, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR, hexAlpha } from "utils"
import Coin from "classes/Coin"
import { observer } from "mobx-react-lite"
import { assets } from "chain-registry"
import { useStore } from "hooks"
import { toJS } from "mobx"
import { s } from "react-native-size-matters"
import ListItem from "components/moleculs/ListItem"

type Props = {
	coin: Coin
	style?: StyleProp<ViewStyle>
}

export default observer(({ coin, style }: Props) => {
	const { settings } = useStore()
	const asset = assets
		.reduce((res: any[], a: any) => res.concat(a.assets), [])
		.find((a: any) => a.base === coin.info.denom)
	const logo = asset && asset.logo_URIs && asset.logo_URIs.png ? asset.logo_URIs.png : undefined
	const source: ImageURISource = { uri: logo }
	const name = asset ? asset.name.replace("Fantoken", "") : "undefined"
	const display = asset ? asset.display.toUpperCase() : "Undefined"
	const balance = coin.balance.toLocaleString("en")
	const balanceUSD = coin.balanceUSD ? coin.balanceUSD.toLocaleString("en") : undefined

	return (
		<ListItem
			uri={logo}
			title={name}
			subtitle={display}
			description={balance}
			subdescription={balanceUSD ? (balanceUSD + " " + settings.prettyCurrency?.symbol) : undefined}
			style={style}
		/>
	)
})