import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { IValidator } from "classes/types"
import { Icon2, Input } from "components/atoms"
import { useStore } from "hooks"
import { observer } from "mobx-react-lite"
import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, View } from "react-native"
import { COLOR, InputHandler } from "utils"
import { ValidatorListItem } from "../moleculs"

type Props = {
	onPressValidator(validator: IValidator): void
	activeValidator?: IValidator | null
}

export default observer<Props>(({ onPressValidator, activeValidator }) => {
	const { validator } = useStore()

	const input = useMemo(() => new InputHandler(), [])

	const filtredValidators = useMemo(() => {
		if (input.value) {
			const lowerCase = input.value.toLowerCase()
			return validator.validators.filter(({ name }) => name.toLowerCase().includes(lowerCase))
		} else {
			return validator.validators
		}
	}, [input.value])

	const renderValidator = useCallback<ListRenderItem<IValidator>>(
		({ item }) => (
			<ValidatorListItem
				onPress={() => onPressValidator(item)}
				avatar={item.logo}
				name={item.name}
				isActive={activeValidator === item}
				style={{ marginBottom: 2 }}
			/>
		),
		[activeValidator],
	)

	return (
		<>
			<Input
				style={styles.input}
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
		borderRadius: 20,
		marginTop: 34,
		marginBottom: 7,
	},

	iconContainer: {
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
	},

	flatlistContent: {
		paddingVertical: 7,
	},
})
