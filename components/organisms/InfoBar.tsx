import { View, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import { Paragraph } from 'components/atoms'
import { s } from 'react-native-size-matters'
import { COLOR } from 'utils'
import { TextStyle } from 'react-native'

type Props = {
	text: string,
	backgroundColor?: string,
	color?: string,
	containerStyle?: ViewStyle,
	textStyle?: TextStyle,
}

export default function InfoBar({text, backgroundColor = COLOR.Pink5, color = COLOR.White, containerStyle, textStyle}: Props) {
  return (
	<View style={[styles.darkBackground, styles.containerPadding, {backgroundColor}, containerStyle]}>
	  <Paragraph style={[styles.textColor, styles.textSize, styles.textAlign, styles.textMargin, {color}, textStyle]}>
		{text}
	  </Paragraph>
	</View>
  )
}

const styles = StyleSheet.create({
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