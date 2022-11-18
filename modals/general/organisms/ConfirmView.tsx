import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Button, Title } from 'components/atoms'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { s } from 'react-native-size-matters'
import HorizontalWrapper from 'screens/layout/HorizontalWrapper'

type Props = {
	titleTranslationString?: string,
	onPressConfirm?(): void
}

export default function ConfirmView(props: PropsWithChildren<Props>)
{
	const { t } = useTranslation()
	const {titleTranslationString = "ConfirmViewTitle", onPressConfirm, children} = props
	return (
		<View>
			<HorizontalWrapper style={styles.verticalMainLayout}>
				<Title size={20} alignment="center" style={styles.marginBottom}>{t(titleTranslationString)}</Title>
				<BottomSheetScrollView>
					{children}
				</BottomSheetScrollView>
				<Button text={t("Confirm")} textAlignment="center" onPress={onPressConfirm} style={styles.marginTop} />
			</HorizontalWrapper>
		</View>
	)
}

const styles = StyleSheet.create({
	verticalMainLayout: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		height: "100%",
		marginBottom: s(10),
	},
	marginTop: {
		marginTop: s(20),
	},
	marginBottom: {
		marginBottom: s(20),
	},
})
