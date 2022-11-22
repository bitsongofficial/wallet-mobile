import { View, Text, GestureResponderEvent, BackHandler } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { AminoMsg } from '@cosmjs-rn/amino'
import KeplrMessageItem from './KeplrMessageItem'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import KeplrMessageDetails from './KeplrMessageDetails'

type Props = {
	messages: AminoMsg[]
}

export default function KeplrSignRecap({messages}: Props) {
	const [activeMessage, setActiveMessage] = useState<number>()
	const messagesElements = useMemo(() => messages.map((msg, i) =>
		<TouchableOpacity onPress={() => setActiveMessage(i)}>
			<KeplrMessageItem key={i} msg={msg}></KeplrMessageItem>
		</TouchableOpacity>
	), [messages])
	const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
		if(activeMessage) {
			setActiveMessage(undefined)
			return true
		}
		return false
	})
	useEffect(() =>
	{
		return () =>
		{
			backHandler.remove()
		}
	}, [])
	return (
		<View>
			{activeMessage == undefined && messagesElements}
			{activeMessage != undefined && <KeplrMessageDetails msg={messages[activeMessage]}></KeplrMessageDetails>}
		</View>
	)
}