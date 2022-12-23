import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from 'hooks'
import JSONTree from 'react-native-json-tree'

type Props = {
	data: any
}

export default function SignArbitraryRecap({data}: Props) {
	const theme = useTheme()
  return (
	<JSONTree data={JSON.stringify(data)} invertTheme={false} theme={theme.jsonTheme} />
  )
}