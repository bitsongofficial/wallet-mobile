import { useCallback, useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { StatusBar } from "expo-status-bar"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR, InputHandler } from "utils"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Input } from "components/atoms"

type Props = NativeStackScreenProps<RootStackParamList, "Validator">

export default observer<Props>(function Stacking({ navigation }) {
	const goBack = useCallback(() => navigation.goBack(), [])

	const nameInput = useMemo(() => new InputHandler(), [])

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.safearea}>
				<ScrollView style={styles.container}>
					<Text style={styles.title}>Create New Proposal</Text>

					<Text style={styles.label}>Name</Text>
					<Input
						value={nameInput.value}
						onChangeText={nameInput.set}
						style={styles.input}
						placeholder="My super proposal"
					/>

					<Text style={styles.label}>Typology</Text>
					<Input style={styles.input} placeholder="Text Proposal" />

					<Text style={styles.label}>Initial Deposit</Text>
					<Input style={styles.input} placeholder="0" />

					<Text style={styles.label}>Text Proposal</Text>
					<Input
						multiline
						numberOfLines={4}
						style={styles.textarea}
						inputStyle={styles.textAreaInput}
						placeholder="Text area..."
					/>
				</ScrollView>

				<View style={styles.footer}>
					<Button
						text="Save as a draft"
						mode="fill"
						textStyle={styles.buttonText}
						contentContainerStyle={styles.buttonContentFill}
					/>
					<Button
						text="Publish"
						textStyle={styles.buttonText}
						contentContainerStyle={styles.buttonContent}
					/>
				</View>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	safearea: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
	},
	container: {
		// paddingTop: 40, // for header
		marginTop: Platform.OS === "ios" ? 30 : 60,
		paddingHorizontal: 30,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 23,
		color: COLOR.White,

		marginBottom: 36,
	},

	label: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,

		marginBottom: 8,
	},
	input: {
		borderRadius: 20,
		marginBottom: 20,
	},
	textarea: {
		height: 166,
		borderRadius: 20,
	},
	textAreaInput: {
		flex: 1,
	},

	footer: {
		flexDirection: "row",
		paddingHorizontal: 30,
		justifyContent: "space-between",
	},

	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
	},

	buttonContent: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},

	buttonContentFill: {
		paddingHorizontal: 0,
		paddingVertical: 18,
	},
})
