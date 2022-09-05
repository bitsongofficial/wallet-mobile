import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Subtitle, Title } from "../atoms"
import { Footer, CreateSeed } from "../organisms"
import { Phrase } from "classes"

type Props = {
	phrase: Phrase
	isHidden: boolean
	onPressToggle(): void
	onPressBack(): void
	onPressNext(): void
}

export default observer<Props>(({ isHidden, onPressToggle, phrase, onPressBack, onPressNext }) => (
	<>
		<View>
			<Title style={styles.title}>Create New Mnemonic</Title>
			<Subtitle style={styles.subtitle}>
				This is the only way you will be able to {"\n"}
				recover your account. Please store it{"\n"}
				somewhere safe!
			</Subtitle>
		</View>

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
			nextButtonText={isHidden ? "Skip" : "Continue"}
		/>
	</>
))

const styles = StyleSheet.create({
	title: { marginTop: 50 },
	subtitle: { marginTop: 8 },
})