import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, CreateSeed } from "../organisms"
import { Phrase } from "classes"
import { vs } from "react-native-size-matters"
import { TitledParagraph } from "components/moleculs"
import { useTranslation } from "react-i18next"

type Props = {
	phrase: Phrase
	isHidden: boolean
	onPressToggle(): void
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ isHidden, onPressToggle, phrase, onPressBack, onPressNext }) =>
{
	const { t } = useTranslation()
	return (
		<>
			<TitledParagraph
				title={t("CreateNewMnemonic")}
				text={t("OnlyWayToRecoverMnemonic")}
				style={styles.title}
			></TitledParagraph>
	
			{phrase.words && (
				<CreateSeed
					isHidden={isHidden}
					onPressToggle={onPressToggle}
					phrase={phrase}
					//
				/>
			)}
	
			<Footer
				onPressBack={onPressBack}
				onPressNext={onPressNext}
				nextButtonText={isHidden ? t("Skip") : t("Continue")}
			/>
		</>
	)
})

const styles = StyleSheet.create({
	title: { marginTop: vs(50) },
	subtitle: { marginTop: vs(8) },
})
