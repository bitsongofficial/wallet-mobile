import { View, Text } from 'react-native'
import React from 'react'
import { ListItem } from 'components/moleculs'
import { aminoTypePrettyName, getAminoMessageDescriptionKey, OsmosisAminoTypes } from 'core/coin/cosmos/operations/utils'
import { AminoMsg } from '@cosmjs-rn/amino'
import { useTranslation } from 'react-i18next'
import { useStore } from 'hooks'
import { convertRateFromDenom, getBaseDenomName, getDenomExponent, resolveAsset } from 'core/utils/Coin'

type Prop = {
	msg: AminoMsg
}

export default function KeplrMessageItem({msg}: Prop) {
	const { t } = useTranslation()
	const messageDescriptionKey = getAminoMessageDescriptionKey(msg)
	const args: any = {}
	switch(msg.type)
	{
		case OsmosisAminoTypes.SwapExact:
			const threshold = 10000
			const amountFrom = parseFloat(msg.value.token_in.amount)
			const amountTo = parseFloat(msg.value.token_out_min_amount)
			const denomFrom = resolveAsset(msg.value.token_in.denom)
			const denomTo = resolveAsset(msg.value.routes[0].token_out_denom)
			const displayDenomFrom = amountFrom > threshold ? getBaseDenomName(denomFrom) : denomFrom
			const displayDenomTo = amountTo > threshold ? getBaseDenomName(denomTo) : denomTo
			const displayAmountFrom = amountFrom > threshold ? (amountFrom / convertRateFromDenom(denomFrom)) : amountFrom
			const displayAmountTo = amountTo > threshold ? (amountTo / convertRateFromDenom(denomTo)) : amountTo
			args.from = displayAmountFrom + " " + displayDenomFrom ?? denomFrom
			args.to = displayAmountTo + " " + displayDenomTo ?? denomTo
			break
	}
	return (
		<ListItem
			title={aminoTypePrettyName(msg.type) ?? t("UnknownKeplrOperation")}
			subtitle={t(messageDescriptionKey, args)}
		/>
	)
}