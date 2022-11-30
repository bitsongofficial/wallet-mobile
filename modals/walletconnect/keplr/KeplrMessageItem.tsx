import { View, Text } from 'react-native'
import React from 'react'
import { ListItem } from 'components/moleculs'
import { aminoTypePrettyName, getAminoMessageDescriptionKey, OsmosisAminoTypes } from 'core/coin/cosmos/operations/utils'
import { AminoMsg } from '@cosmjs-rn/amino'
import { useTranslation } from 'react-i18next'
import { useStore } from 'hooks'
import { resolveAsset } from 'core/utils/Coin'

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
			args.from = msg.value.token_in.amount + " " + msg.value.token_in.denom
			args.to = msg.value.token_out_min_amount + " " + resolveAsset(msg.value.routes[0].token_out_denom)
			break
	}
	return (
		<ListItem
			title={aminoTypePrettyName(msg.type) ?? t("UnknownKeplrOperation")}
			subtitle={t(messageDescriptionKey, args)}
		/>
	)
}