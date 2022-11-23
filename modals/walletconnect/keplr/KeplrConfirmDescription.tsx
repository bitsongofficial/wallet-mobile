import { Text } from 'components/Themed'
import { useTheme } from 'hooks'
import React from 'react'
import { Trans } from 'react-i18next'

type Prop = {
	profile: string,
}

export default function KeplrConfirmDescription({profile}: Prop)
{
	const theme = useTheme()
	return (
		<Text style={theme.text.primary}>
			<Trans i18nKey={"KeplrGetKeyDescription"} values={{profileName: profile}}>

			</Trans>
		</Text>
	)
}
