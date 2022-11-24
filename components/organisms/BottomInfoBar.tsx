import { View, StyleSheet } from 'react-native'
import React from 'react'
import { COLOR } from 'utils'
import { s } from 'react-native-size-matters'
import { Paragraph, Title } from 'components/atoms'
import InfoBar from './InfoBar'

type Props = {
	text: string,
}

export default function BottomInfoBar({text}: Props) {
  return (
	<InfoBar text={text} containerStyle={styles.bottom}></InfoBar>
  )
}

const styles = StyleSheet.create({
	bottom: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	containerPadding: {
		paddingHorizontal: s(4),
		paddingVertical: s(2),
	},
	darkBackground: {
		backgroundColor: COLOR.Pink5,
	},
	textColor: {
		color: COLOR.White,
	},
	textSize: {
		fontSize: s(12),
	},
	textAlign: {
		textAlign: "center",
	},
	textMargin: {
		marginBottom: s(0),
	},
})