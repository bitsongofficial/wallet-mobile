import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Footer, SetPin } from "../organisms"
import { Pin } from "classes"
import { vs } from "react-native-size-matters"
import { TitledParagraph } from "components/moleculs"
import { useTranslation } from "react-i18next"

type Props = {
	pin: Pin
	isDisableNext: boolean
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ pin, isDisableNext, onPressBack, onPressNext }) =>
{
	const { t } = useTranslation()
	return (
		<>
			<TitledParagraph
				title={t("ConfirmWithPin")}
				style={styles.title}
			>
				{t("OnlyWayToRecoverMnemonic")}
			</TitledParagraph>
	
			<View style={styles.content}>
				<SetPin pin={pin} />
			</View>
	
			<Footer
				nextButtonText={t("LetsStart")}
				onPressBack={onPressBack}
				onPressNext={onPressNext}
				isDisableNext={isDisableNext}
			/>
		</>
	)
})

const styles = StyleSheet.create({
	title: { marginTop: vs(50) },
	content: { flex: 1 },
})
