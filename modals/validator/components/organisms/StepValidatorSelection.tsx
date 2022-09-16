import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { Icon2, Input } from "components/atoms"
import { SupportedCoins } from "constants/Coins"
import { Validator, ValidatorStatus } from "core/types/coin/cosmos/Validator"
import { useStore } from "hooks"
import { observer } from "mobx-react-lite"
import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, View } from "react-native"
import { s, vs } from "react-native-size-matters"
import { COLOR, InputHandler } from "utils"
import { ValidatorListItem } from "../moleculs"

type Props = {
	onPressValidator(validator: Validator): void
	activeValidator?: Validator | null
}

export default observer<Props>(({ onPressValidator, activeValidator }) => {
	const { validators } = useStore()

	const input = useMemo(() => new InputHandler(), [])

	const filtredValidators = useMemo(() => {
		if (input.value) {
			const lowerCase = input.value.toLowerCase()
			return validators.validators.filter(({ name }) => name.toLowerCase().includes(lowerCase))
		} else {
			return validators.validators
		}
	}, [input.value])
	// const filtredValidators = [mock, mock, mock]

	const renderValidator = useCallback<ListRenderItem<Validator>>(
		({ item }) => (
			<ValidatorListItem
				onPress={() => onPressValidator(item)}
				avatar={item.logo}
				name={item.name}
				isActive={activeValidator === item}
				style={{ marginBottom: vs(2) }}
			/>
		),
		[activeValidator],
	)

	return (
		<>
			<Input
				style={styles.input}
				inputStyle={styles.inputItem}
				bottomsheet
				value={input.value}
				onChangeText={input.set}
				placeholder="Search Validator"
				Right={
					<View style={styles.iconContainer}>
						<Icon2 name="loupe" stroke={COLOR.Marengo} size={21} />
					</View>
				}
			/>
			<BottomSheetFlatList
				contentContainerStyle={styles.flatlistContent}
				data={filtredValidators}
				renderItem={renderValidator}
			/>
		</>
	)
})

const styles = StyleSheet.create({
	input: {
		backgroundColor: COLOR.Dark3,
		borderRadius: s(20),
		marginTop: vs(34),
		marginBottom: vs(7),
	},
	inputItem: {
		height: s(62),
	},

	iconContainer: {
		paddingHorizontal: s(24),
		alignItems: "center",
		justifyContent: "center",
	},

	flatlistContent: {
		paddingVertical: s(7),
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
