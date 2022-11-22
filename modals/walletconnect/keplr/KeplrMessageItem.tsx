import { View, Text } from 'react-native'
import React from 'react'
import { ListItem } from 'components/moleculs'
import { aminoTypePrettyName } from 'core/coin/cosmos/operations/utils'
import { AminoMsg } from '@cosmjs-rn/amino'
import { useTranslation } from 'react-i18next'

type Prop = {
	msg: AminoMsg
}

export default function KeplrMessageItem({msg}: Prop) {
	const { t } = useTranslation()
	return (
		<ListItem
			title={aminoTypePrettyName(msg.type) ?? t("UnknownKeplrOperation")}
			subtitle={msg.type}
		/>
	)
}