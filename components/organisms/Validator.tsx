import { useCallback, useEffect, useMemo, useState } from "react"
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Validator, ValidatorStatus, SignerInfo } from "core/types/coin/cosmos/Validator"
import { useStore } from "hooks"
import { validatorIdentity } from "core/rest/keybase"
import { SupportedCoins } from "constants/Coins"

type ValidatorProps = {
	item: Validator
	onPressKebab(item: Validator): void
	style?: StyleProp<ViewStyle>
}

export default ({ item, onPressKebab, style }: ValidatorProps) => {
	const { validators } = useStore()
	// const validator = validators.resolveValidator(item) ?? validators.validators[0]
	const validator = mock

	const handlePressKebab = useCallback(() => onPressKebab(validator), [validator])

	const source = useMemo(() => ({ uri: validator?.logo || "" }), [validator?.logo])

	// const [logo, setLogo] = useState("")

	// useEffect(() =>
	// {
	// 	validatorIdentity(validator.identity).then((identity) =>
	// 	{
	// 		if(validator.identity)
	// 		{
	// 			console.log("A", validator.identity, identity)
	// 			setLogo(identity.picture_url)
	// 		}
	// 	}).catch((e) =>
	// 	{
	// 		console.error("Catched", e)
	// 	})
	// }, [validator, validator.identity])

	return (
		<View style={[styles.container, style]}>
			<View style={[styles.row, { marginBottom: 14 }]}>
				<View style={styles.info}>
					{source && <Image style={styles.avatar} source={source} />}
					<Text style={styles.title}>{validator.name}</Text>
				</View>
				<RectButton onPress={handlePressKebab}>
					<Icon2 name="kebab" stroke={COLOR.Marengo} size={24} />
				</RectButton>
			</View>
			<View style={styles.footer}>
				<View style={styles.left}>
					<Text style={styles.percent}>{validators.apr(validator).toFixed(2)} %</Text>
					<Text style={styles.text}>APR</Text>
				</View>
				<View style={styles.right}>
					<Text style={styles.percent}>
						{validators.percentageVotingPower(validator).toFixed(2)} %
					</Text>
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

const mock: Validator = {
	id: "1",
	commission: {
		change: {
			last: new Date(),
			max: 5,
		},
		rate: {
			current: 4,
			max: 5,
		},
	},
	description: "description",
	identity: "identity",
	// logo: "logo",
	name: "name",
	operator: "operator",
	status: {
		status: ValidatorStatus.ACTIVE,
		statusDetailed: "statusDetailed",
	},
	tokens: 1234567890,
	userClaimAmount: 123456789,
	userDelegation: 12345678,
	chain: SupportedCoins.BITSONG,
	signingInfo: {
		address: "address",
		index_offset: "index_offset",
		jailed_until: "jailed_until",
		missed_blocks_counter: "missed_blocks_counter",
		start_height: "start_height",
		tombstoned: false,
	},
}
