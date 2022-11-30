import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import { Button, Title } from 'components/atoms'
import React, { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { s } from 'react-native-size-matters'
import HorizontalWrapper from 'screens/layout/HorizontalWrapper'

type Props = {
	titleTranslationString?: string,
	onPressConfirm?(): void,
	onPressReject?(): void,
	header?: ReactNode
}

export default function ConfirmView(props: PropsWithChildren<Props>)
{
	const { t } = useTranslation()
	const {titleTranslationString = "ConfirmViewTitle", onPressConfirm, onPressReject, header, children} = props
	return (
		<BottomSheetView style={styles.container}>
			<HorizontalWrapper style={styles.verticalMainLayout}>
				<>
					{header}
					<Title size={20} alignment="center" style={styles.marginBottom}>{t(titleTranslationString)}</Title>
					<BottomSheetScrollView style={styles.flexShrink}>
						{children}
					</BottomSheetScrollView>
					{onPressConfirm != undefined && <Button text={t("Confirm")} textAlignment="center" onPress={onPressConfirm} style={styles.marginTop} />}
					{onPressReject != undefined && <Button mode="gradient_border" text={t("Reject")} textAlignment="center" onPress={onPressConfirm} style={styles.marginTopSmall} />}
				</>
			</HorizontalWrapper>
		</BottomSheetView>
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
	marginTopSmall: {
		marginTop: s(4),
	},
	marginBottom: {
		marginBottom: s(20),
	},
	flexShrink: {
		flexShrink: 1,
	},
	container: {
		paddingTop: s(10),
		paddingBottom: s(20),
	}
})
