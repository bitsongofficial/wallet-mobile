import { Text } from 'components/Themed'
import { useTheme } from 'hooks'
import React, { useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { s } from 'react-native-size-matters'
import { COLOR } from 'utils'

type Prop = {
	icon?: string,
	url?: string,
	name?: string,
}

export default function KeplrConfirmHeader({url, icon, name}: Prop)
{
	const source = useMemo(() => ({uri: icon}), [icon])
	const theme = useTheme()
	return (
		<>
			<View style={styles.infoHeader}>
				{icon != undefined && <Image source={source} style={[styles.headerImage]}></Image>}
				{url != undefined && <Text style={[theme.text.primary, styles.infoHeaderMargin, styles.infoHeaderText]}>{url}</Text>}
				{name != undefined && <Text style={[theme.text.primary, styles.infoHeaderMargin, styles.infoHeaderText, styles.headerTitle]}>{name}</Text>}
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	infoHeader: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	infoHeaderMargin: {
		marginBottom: 10,
	},
	infoHeaderText: {
		textAlign: "center",
	},
	headerImage: {
		width: s(64),
		height: s(64),
	},
	headerTitle: {
		fontSize: s(16),
		fontWeight: "bold",
	},
})