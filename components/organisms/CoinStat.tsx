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
import { SupportedCoins } from "constants/Coins"
import { getAssetIcon, getAssetName, getAssetTag } from "core/utils/Coin"
import { useTranslation } from "react-i18next"

type Props = {
	coin: Coin
	style?: StyleProp<ViewStyle>
}

export default observer(({ coin, style }: Props) => {
	const { t } = useTranslation()
	const { settings, coin: cs } = useStore()
	const chain = coin.info.coin
	const denom = coin.info.denom
	const logo = getAssetIcon(denom)
	const name = getAssetName(denom)
	const display = getAssetTag(denom) + (chain == SupportedCoins.BITSONG118 || chain == SupportedCoins.BITSONG118_TESTNET ? " (" + t("CosmosCompatible") + ")" : "")
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