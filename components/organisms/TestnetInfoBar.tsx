import { View, Text } from 'react-native'
import React from 'react'
import InfoBar from './InfoBar'
import { useTranslation } from 'react-i18next'
import { useStore } from 'hooks'
import { COLOR } from 'utils'

export default function TestnetInfoBar() {
	const { t } = useTranslation()
	const { settings } = useStore()
	return (
		<InfoBar backgroundColor={settings.testnet ? COLOR.Pink5 : COLOR.Pink4} text={settings.testnet ? t("Testnet") : t("Mainnet")}></InfoBar>
	)
}