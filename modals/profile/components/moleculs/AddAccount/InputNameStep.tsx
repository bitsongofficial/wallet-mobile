import { StyleSheet, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { COLOR, InputHandler } from "utils"
import { StyledInput, Subtitle, Title } from "../../atoms"

type InputNameStepProps = {
	input: InputHandler
}

export default observer(({ input }: InputNameStepProps) => (
	<>
		<Title style={styles.title}>Name your Wallet</Title>
		<Text style={styles.caption}>
			This is the only way you will be able to{"\n"}
			recover your account.Please onPressAddstore it {"\n"}
			somewhere safe!
		</Text>
		<StyledInput
			value={input.value}
			onChangeText={input.set}
			placeholder="Write a name"
			autoFocus
			isFocus={input.isFocused}
			onFocus={input.focusON}
			onBlur={input.focusOFF}
			style={{ marginBottom: 24 }}
			keyboardAppearance="dark"
		/>
		<Subtitle style={styles.subtitle}>
			Access VIP experiences, exclusive previews,{"\n"}
			finance your own music projects and have your say.
		</Subtitle>
	</>
))

const styles = StyleSheet.create({
	title: {
		fontSize: 16,
		lineHeight: 20,
		textAlign: "center",

		marginBottom: 30,
	},
	subtitle: {
		fontSize: 14,
		lineHeight: 18,
		textAlign: "center",
		opacity: 0.3,
	},

	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,

		textAlign: "center",
		color: COLOR.Marengo,
		marginBottom: 26,
	},
})
