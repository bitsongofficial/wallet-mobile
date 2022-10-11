import { useCallback } from "react"
import { ListRenderItem, StyleSheet } from "react-native"
import SelectBase, { Props as SelectProps } from "./SelectBase"
import { Coin } from "classes"
import { CoinStat } from "components/organisms"
import { useTranslation } from "react-i18next"

export type Props = Omit<SelectProps<Coin>, "title" | "description" | "renderFunction" | "items"> & {
	active?: Coin
	activeIndex?: number
	hideSelector?: boolean
	coins: Coin[]
	title?: string,
	description?: string,
}

export default (
	{
		active,
		activeIndex,
		coins,
		title,
		description,
		...props
	}: Props) =>
{
	const { t } = useTranslation()
	const render = useCallback<ListRenderItem<Coin>>(
		({ item, index }) =>
		(
			<CoinStat coin={item} />
		),
		[active, activeIndex],
	)

	return (
		<SelectBase
			{...props}
			title={title ?? t("SelectCoinTitle")}
			description={description ?? t("SelectCoinDescription")}
			items={coins}
			renderFunction = {render}
		/>
	)
}

const styles = StyleSheet.create({
	activeItem: {

	}
})