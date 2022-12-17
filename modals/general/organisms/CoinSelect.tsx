import { useCallback } from "react"
import { ListRenderItem, StyleSheet } from "react-native"
import SelectBase, { Props as SelectProps } from "./SelectBase"
import { Coin } from "classes"
import { CoinStat } from "components/organisms"
import { useTranslation } from "react-i18next"
import { AssetBalance } from "stores/models/AssetBalance"

export type Props = Omit<SelectProps<AssetBalance>, "title" | "description" | "renderFunction" | "items"> & {
	active?: AssetBalance
	activeIndex?: number
	hideSelector?: boolean
	assets: AssetBalance[]
	title?: string,
	description?: string,
}

export default (
	{
		active,
		activeIndex,
		assets,
		title,
		description,
		...props
	}: Props) =>
{
	const { t } = useTranslation()
	const render = useCallback<ListRenderItem<AssetBalance>>(
		({ item, index }) =>
		(
			<CoinStat assetBalance={item} />
		),
		[active, activeIndex],
	)

	return (
		<SelectBase
			{...props}
			title={title ?? t("SelectCoinTitle")}
			description={description ?? t("SelectCoinDescription")}
			items={assets}
			renderFunction = {render}
		/>
	)
}

const styles = StyleSheet.create({
	activeItem: {

	}
})