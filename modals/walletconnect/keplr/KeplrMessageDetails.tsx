import { View, Text } from 'react-native'
import React from 'react'
import { JSONTree } from 'components/Themed'
import { AminoMsg } from '@cosmjs-rn/amino'

type Props = {
	msg: AminoMsg
}

export default function KeplrMessageDetails({msg}: Props) {
	return (
		<View>
			<JSONTree data={JSON.stringify(msg)}></JSONTree>
		</View>
	)
}