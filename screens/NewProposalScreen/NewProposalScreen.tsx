import { useCallback, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar } from "expo-status-bar"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import {
	BackHandler,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from "react-native"
import { RootStackParamList } from "types"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { RectButton, ScrollView } from "react-native-gesture-handler"
import { Button, Icon2, Input } from "components/atoms"
import { ViewProps } from "components/Themed"
import { useHeaderHeight } from "@react-navigation/elements"
import { openChangeVoteTypology } from "modals/proposal"
import { useStore } from "hooks"
import { SupportedCoins } from "constants/Coins"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { s, vs } from "react-native-size-matters"

type Props = NativeStackScreenProps<RootStackParamList, "NewProposal">

export default observer<Props>(function Stacking({ navigation, route }) {
	const { proposals } = useStore()
	const savedProposal = proposals.proposalDraft
	const goBack = useCallback(() => {
		if (route.params.onDismiss) route.params.onDismiss()
		navigation.goBack()
	}, [])
	const passive = route.params.passive ?? false

	const nameInput = useMemo(
		() =>
			new InputHandler(
				route.params.title ?? (savedProposal ? savedProposal.title : "My super proposal"),
			),
		[],
	)

	const [typology, setTypology] = useState<"text">("text")
	const openChooseProposalTypologyModal = useCallback(
		() =>
			openChangeVoteTypology({
				typology,
				onChange: setTypology,
			}),
		[typology],
	)
	const inputDescription = useMemo(
		() =>
			new InputHandler(
				route.params.description ?? (savedProposal ? savedProposal.description : ""),
			),
		[],
	)

	const inputDeposit = useMemo(
		() =>
			new InputHandler(
				route.params.initialDeposit?.toString() ??
					(savedProposal ? savedProposal.deposit.toString() : ""),
			),
		[],
	)

	const height = useHeaderHeight()

	const saveProposalDraft = useCallback(() => {
		proposals.saveProposalDraft(
			route.params.chain ?? SupportedCoins.BITSONG,
			nameInput.value,
			inputDescription.value,
			parseFloat(inputDeposit.value),
		)
		goBack()
	}, [])

	const submitProposal = useCallback(() => {
		if (route.params.onDone) route.params.onDone()
		else
			navigation.push("Loader", {
				// @ts-ignore
				callback: async () => {
					const res = await proposals.submit(
						route.params.chain ?? SupportedCoins.BITSONG,
						nameInput.value,
						inputDescription.value,
						parseFloat(inputDeposit.value),
					)
					if (res) goBack()
					return res
				},
			})
	}, [])

	useEffect(() => {
		const handler = BackHandler.addEventListener("hardwareBackPress", () => {
			goBack()
			return true
		})
		return () => handler.remove()
	}, [goBack])

	return (
		<>
			<StatusBar style="light" />
			<SafeAreaView style={styles.safearea}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					enabled
					keyboardVerticalOffset={height}
					style={styles.flex1}
				>
					<ScrollView
						style={styles.container}
						bounces={false}
						contentContainerStyle={[styles.scrollContent]}
					>
						<View style={styles.head}>
							<Text style={styles.title}>Create New Proposal</Text>
							<Button
								mode="gradient_border"
								onPress={goBack}
								contentContainerStyle={styles.buttonGoBackContent}
							>
								<Icon2 name="close" size={16} stroke={COLOR.White} />
							</Button>
						</View>

						<Text style={styles.label}>Name</Text>
						<Input
							value={nameInput.value}
							editable={!passive}
							style={styles.inputContainer}
							inputStyle={styles.input}
							onChangeText={nameInput.set}
						/>

						<Text style={styles.label}>Typology</Text>

						<RectButton onPress={openChooseProposalTypologyModal}>
							<View pointerEvents="none">
								<Input
									value={typology === "text" ? "Text Proposal" : "Software Update"}
									editable={false}
									Right={
										<InputRightContainer>
											<Icon2 name="chevron_down_fixed" size={18} stroke={COLOR.White} />
										</InputRightContainer>
									}
									style={styles.inputContainer}
									inputStyle={styles.input}
								/>
							</View>
						</RectButton>

						<Text style={styles.label}>Initial Deposit</Text>
						<Input
							placeholder="0"
							Right={
								<InputRightContainer>
									<Text style={styles.coinName}>BTSG</Text>
								</InputRightContainer>
							}
							keyboardAppearance="dark"
							keyboardType="decimal-pad"
							value={inputDeposit.value}
							onChangeText={inputDeposit.set}
							style={styles.inputContainer}
							inputStyle={styles.input}
							editable={!passive}
						/>

						<Text style={styles.label}>Text Proposal</Text>

						<Input
							placeholder="Text area..."
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							keyboardAppearance="dark"
							style={styles.textarea}
							inputStyle={[styles.input, styles.textAreaInput]}
							value={inputDescription.value}
							onChangeText={inputDescription.set}
							editable={!passive}
						/>
					</ScrollView>
				</KeyboardAvoidingView>
				<View style={[styles.footer, passive ? { justifyContent: "flex-end" } : undefined]}>
					{!passive && (
						<Button
							text="Save draft"
							mode="fill"
							textStyle={styles.buttonText}
							contentContainerStyle={styles.buttonContentFill}
							onPress={saveProposalDraft}
						/>
					)}
					<Button
						text="Publish"
						textStyle={styles.buttonText}
						contentContainerStyle={styles.buttonContent}
						onPress={submitProposal}
					/>
				</View>
			</SafeAreaView>
		</>
	)
})

const InputRightContainer = (props: ViewProps) => (
	<View {...props} style={[styles.inputRightContainer, props.style]} />
)

const styles = StyleSheet.create({
	safearea: {
		backgroundColor: COLOR.Dark3,
		flex: 1,
	},
	flex1: { flex: 1 },
	container: {
		backgroundColor: COLOR.Dark3,
		zIndex: 0,
		paddingBottom: vs(8),
	},
	scrollContent: {
		paddingHorizontal: HORIZONTAL_WRAPPER,
	},

	head: {
		flexDirection: "row",
		marginBottom: vs(36),
		alignItems: "center",
		justifyContent: "space-between",
	},

	buttonGoBackContent: {
		paddingVertical: s(13),
		paddingHorizontal: s(13),
		backgroundColor: COLOR.Dark3,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		lineHeight: s(23),
		color: COLOR.White,
	},

	coinName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(15),
		color: COLOR.RoyalBlue6,
	},

	// ---------- Inputs -----------
	label: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: hexAlpha(COLOR.White, 30),

		marginBottom: vs(8),
	},

	inputContainer: {
		borderRadius: s(20),
		marginBottom: vs(20),
	},
	input: {
		paddingHorizontal: s(30),
		paddingVertical: s(22),
		height: s(62),
	},
	textarea: {
		height: vs(166),
		borderRadius: s(20),
		marginBottom: vs(8),
	},
	textAreaInput: {
		height: "100%",
		paddingTop: s(22),
		paddingBottom: s(22),
		paddingHorizontal: s(32),
	},

	// ---------- Footer ------------

	footer: {
		flexDirection: "row",
		paddingHorizontal: HORIZONTAL_WRAPPER,
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: vs(8),
	},

	buttonText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.White,
	},

	buttonContent: {
		paddingHorizontal: s(40),
		paddingVertical: s(18),
	},

	buttonContentFill: {
		paddingHorizontal: s(35),
		paddingVertical: s(18),
	},

	inputRightContainer: {
		height: "100%",
		paddingHorizontal: s(30),
		alignItems: "center",
		flexDirection: "row",
	},
})
