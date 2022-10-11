import { useCallback, useEffect, useMemo, useState } from "react"
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR } from "utils"
import { Icon2 } from "components/atoms"
import { Validator, ValidatorStatus, SignerInfo } from "core/types/coin/cosmos/Validator"
import { useStore } from "hooks"
import { validatorIdentity } from "core/rest/keybase"
import { SupportedCoins } from "constants/Coins"
import { s } from "react-native-size-matters"
import ListItem from "components/moleculs/ListItem"
import { formatNumber } from "utils/numbers"

type ValidatorProps = {
	item: Validator
	onPressKebab(item: Validator): void
	style?: StyleProp<ViewStyle>
}

export default ({ item, onPressKebab, style }: ValidatorProps) => {
	const { validators } = useStore()
	const validator = validators.resolveValidator(item) ?? validators.validators[0]
	// const validator = mock

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
		<ListItem
			uri={validator?.logo}
			title={validator.name}
			subtitle={validators.apr(validator).toFixed(2) + "% APR"}
			description={validators.percentageVotingPower(validator).toFixed(2) + "%"}
			subdescription="VOTING POWER"
		></ListItem>
	)
}

const styles = StyleSheet.create({
	container: {
		height: s(160),
		borderRadius: s(20),
		backgroundColor: COLOR.Dark2,
		padding: s(24),
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
		fontSize: s(24),
		lineHeight: s(30),

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
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.Marengo,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		lineHeight: s(23),
		flexShrink: 1,

		color: COLOR.White,
	},

	avatar: {
		width: s(42),
		height: s(42),
		borderRadius: s(42),
		backgroundColor: COLOR.Dark3,

		marginRight: s(16),
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
	logo: "logo",
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
