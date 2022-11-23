import { View, Text, GestureResponderEvent, BackHandler, NativeEventSubscription, TouchableOpacity } from 'react-native'
import { useCallback, useEffect, useMemo } from 'react'
import { AminoMsg } from '@cosmjs-rn/amino'
import KeplrMessageItem from './KeplrMessageItem'
import { useState } from 'react'
import KeplrMessageDetails from './KeplrMessageDetails'

type Props = {
	messages: AminoMsg[]
}

export default function KeplrSignRecap({messages}: Props) {
	const [activeMessage, setActiveMessage] = useState<number>()
	useEffect(() =>
	{
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			if(activeMessage !== undefined) {
				setActiveMessage(undefined)
				return true
			}
			return false
		})
		return () =>
		{
			if(backHandler) backHandler.remove()
		}
	}, [activeMessage])

	const messagesElements = useMemo(() => messages.map((msg, i) =>
		{
			const onPress = () =>
			{
				setActiveMessage(i)
			}
			return (
				<TouchableOpacity key={i} onPress={onPress}>
					<KeplrMessageItem msg={msg}></KeplrMessageItem>
				</TouchableOpacity>
			)
		}
	), [messages])
	return (
		<View>
			{activeMessage == undefined && messagesElements}
			{activeMessage != undefined && <KeplrMessageDetails goBack={() => {setActiveMessage(undefined)}} msg={messages[activeMessage]}></KeplrMessageDetails>}
		</View>
	)
}