import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import { StyledInput, Subtitle, Title } from "../../atoms"
import { s, vs } from "react-native-size-matters"

type InputNameStepProps = {
	input: InputHandler
}

export default observer(({ input }: InputNameStepProps) => (
	<>
		<Title style={styles.title}>Name your Wallet</Title>
		<Text style={styles.caption}>
			This is the only way you will be able to recover your account. Please store it somewhere safe!
		</Text>
		<StyledInput
			value={input.value}
			onChangeText={input.set}
			placeholder="Write a name"
			autoFocus
			isFocus={input.isFocused}
			onFocus={input.focusON}
			onBlur={input.focusOFF}
			style={styles.input}
			keyboardAppearance="dark"
		/>
		<Subtitle style={styles.subtitle}>
			Access VIP experiences, exclusive previews, finance your own music projects and have your say.
		</Subtitle>
	</>
))

const styles = StyleSheet.create({
	title: {
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",

		marginBottom: vs(30),
	},
	subtitle: {
		fontSize: s(14),
		lineHeight: s(18),
		textAlign: "center",
		opacity: 0.3,
	},

	input: { marginBottom: vs(24) },

	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: vs(26),
	},
})
