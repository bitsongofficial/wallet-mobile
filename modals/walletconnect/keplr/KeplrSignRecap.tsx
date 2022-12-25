import { BackHandler, TouchableOpacity } from 'react-native'
import { useEffect, useMemo } from 'react'
import { AminoMsg } from '@cosmjs-rn/amino'
import KeplrMessageItem from './KeplrMessageItem'
import { useState } from 'react'
import KeplrMessageDetails from './KeplrMessageDetails'
import { s } from 'react-native-size-matters'
import { ScrollView } from 'react-native-gesture-handler'

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
				<TouchableOpacity key={i} onPress={onPress} style={{marginBottom: s(10)}}>
					<KeplrMessageItem msg={msg}></KeplrMessageItem>
				</TouchableOpacity>
			)
		}
	), [messages])
	return (
		<>
			{activeMessage == undefined &&
				<ScrollView>
					{messagesElements}
				</ScrollView>
			}
			{activeMessage != undefined &&
				<KeplrMessageDetails goBack={() => {setActiveMessage(undefined)}} msg={messages[activeMessage]}></KeplrMessageDetails>
			}
		</>
	)
}