import { Text } from 'components/Themed'
import { useTheme } from 'hooks'
import React, { useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import { s } from 'react-native-size-matters'
import { COLOR } from 'utils'

type Prop = {
	profile: string,
	name?: string,
}

export default function KeplrConfirmDescription({profile, name}: Prop)
{
	const theme = useTheme()
	return (
		<>
			<Text style={[theme.text.primary, styles.description]}>
				<Trans i18nKey={"KeplrGetKeyDescription"} values={{profileName: profile, DApp: name}}>

				</Trans>
			</Text>
		</>
	)
}

const styles = StyleSheet.create({
	description: {
		textAlign: "center",
		fontSize: s(14),
	}
})