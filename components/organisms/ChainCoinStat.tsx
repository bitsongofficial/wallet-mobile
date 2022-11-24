import { StyleProp, ViewStyle } from "react-native"
import Coin from "classes/Coin"
import { observer } from "mobx-react-lite"
import { useStore } from "hooks"
import ListItem from "components/moleculs/ListItem"
import { formatNumber } from "utils/numbers"
import { SupportedCoins } from "constants/Coins"
import { getAssetIcon, getAssetName, getAssetTag, getCoinIcon, getCoinName } from "core/utils/Coin"
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
	const logo = getCoinIcon(chain)
	const name = getCoinName(chain)
	const display = getAssetTag(denom) + (coin.info.coin == SupportedCoins.BITSONG118 ? " (" + t("CosmosCompatible") + ")" : "")
	const balance = coin.balance.toLocaleString("en")
	const balanceFIAT = cs.fromCoinToFiat(coin)

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