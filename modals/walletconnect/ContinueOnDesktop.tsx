import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Title } from 'components/atoms'
import { s } from 'react-native-size-matters'

export default function ContinueOnDesktop() {
	const { t } = useTranslation()
	return (
		<View style={styles.container}>
			<Title alignment="center" size={16}>{t("ContinueOnTheBrowser")}</Title>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: s(6),
		paddingBottom: s(24),
		paddingHorizontal: s(24),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	}
})