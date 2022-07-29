import { useCallback, useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Validator } from "core/types/coin/cosmos/Validator"
import { useStore } from "hooks"
import { validatorIdentity } from "core/rest/keybase"

type ValidatorProps = {
	id: string
	onPressKebab(item: Validator): void
}

export default ({ id, onPressKebab }: ValidatorProps) => {
	const { validators } = useStore()
	const item = validators.resolveValidator(id) ?? validators.validators[0]

	const handlePressKebab = useCallback(() => onPressKebab(item), [item])
	// const [logo, setLogo] = useState("")

	const source = item.logo ? { uri: item.logo } : undefined

	// useEffect(() =>
	// {
	// 	validatorIdentity(item.identity).then((identity) =>
	// 	{
	// 		if(item.identity)
	// 		{
	// 			console.log("A", item.identity, identity)
	// 			setLogo(identity.picture_url)
	// 		}
	// 	}).catch((e) =>
	// 	{
	// 		console.error("Catched", e)
	// 	})
	// }, [item, item.identity])

	return (
		<View style={styles.container}>
			<View style={[styles.row, { marginBottom: 14 }]}>
				<View style={styles.info}>
					{source && <Image style={styles.avatar} source={source} />}
					<Text style={styles.title}>{item.id}</Text>
				</View>
				<RectButton onPress={handlePressKebab}>
					<Icon2 name="kebab" stroke={COLOR.Marengo} size={24} />
				</RectButton>
			</View>
			<View style={styles.footer}>
				<View style={styles.left}>
					<Text style={styles.percent}>{validators.apr(item).toFixed(2)} %</Text>
					<Text style={styles.text}>APR</Text>
				</View>
				<View style={styles.right}>
					<Text style={styles.percent}>{validators.percentageVotingPower(item).toFixed(2)} %</Text>
					<Text style={styles.text}>VOTING POWER</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 160,
		borderRadius: 20,
		backgroundColor: COLOR.Dark2,
		padding: 24,
		marginBottom: 20,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},

	info: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	percent: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 24,
		lineHeight: 30,

		color: COLOR.White,
	},

	footer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},

	left: {
		justifyContent: "space-between",
	},
	right: {
		alignItems: "flex-end",
		justifyContent: "space-between",
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.Marengo,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 23,
		flexShrink: 1,

		color: COLOR.White,
	},

	avatar: {
		width: 42,
		height: 42,
		borderRadius: 42,
		backgroundColor: COLOR.Dark3,

		marginRight: 16,
	},
})
