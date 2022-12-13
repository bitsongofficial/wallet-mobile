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
import { AssetBalance } from "stores/models/AssetBalance"

type Props = {
	assetBalance: AssetBalance
	style?: StyleProp<ViewStyle>
}

export default observer(({ assetBalance, style }: Props) => {
	const { t } = useTranslation()
	const { settings, coin: cs,  assets, chains} = useStore()
	const denom = assetBalance.denom
	const asset = assets.ResolveAsset(denom)
	const chain = assets.AssetChain(denom)
	const chainKey = assetBalance.chain
	const logo = asset?.icon
	const name = asset?.name
	const display = asset?.tag + (chainKey == SupportedCoins.BITSONG118 || chainKey == SupportedCoins.BITSONG118_TESTNET ? " (" + t("CosmosCompatible") + ")" : "")
	const balance = formatNumber(cs.balanceAsExponent(assetBalance))
	const balanceFIAT = cs.fiatAsExponent(cs.fromAssetBalanceToFiat(assetBalance) ?? 0, denom)

	return (
		<ListItem
			uri={logo}
			title={name ?? ""}
			subtitle={display}
			description={balance}
			subdescription={balanceFIAT ? (formatNumber(balanceFIAT) + " " + settings.prettyCurrency?.symbol) : undefined}
			style={style}
		/>
	)
})