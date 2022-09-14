import { useCallback, useMemo } from "react"
import { Dimensions, ListRenderItem, StyleSheet, View } from "react-native"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { observer } from "mobx-react-lite"
import { useStore } from "hooks"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { StyledInput, Title } from "../atoms"
import { CurrencyItem } from "../moleculs"
import currencies from "constants/currencies"
import { ICurrency } from "screens/Profile/type"
import { Icon2 } from "components/atoms"
import { s, vs } from "react-native-size-matters"

type Props = {
	close(): void
}

export default observer<Props>(({ close }) => {
	const { settings } = useStore()
	// --------- Search ---------

	const input = useMemo(() => new InputHandler(), [])

	const filtred = useMemo(() => {
		if (input.value) {
			const lowerCase = input.value.toLowerCase()
			return currencies.filter(({ name }) => name.toLowerCase().includes(lowerCase))
		} else {
			return currencies
		}
	}, [input.value])

	// ------- FlatList ----------

	const setCurrency = useCallback((currency: ICurrency) => {
		settings.setCurrency(currency)
		close()
	}, [])

	const keyExtractor = ({ _id }: ICurrency) => _id
	const renderCurrencies = useCallback<ListRenderItem<ICurrency>>(
		({ item }) => (
			<CurrencyItem
				value={item}
				key={item._id}
				isActive={settings.currency?._id === item._id}
				onPress={setCurrency}
			/>
		),
		[settings.currency],
	)

	return (
		<View style={styles.container}>
			<Title style={styles.title}>Seleziona Valuta</Title>
			<StyledInput
				placeholder="Cerca Valuta"
				value={input.value}
				onChangeText={input.set}
				style={styles.search}
				Right={
					<View style={styles.iconContainer}>
						<Icon2 name="magnifying_glass" stroke={hexAlpha(COLOR.White, 20)} size={21} />
					</View>
				}
			/>
			<BottomSheetFlatList
				data={filtred}
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				keyExtractor={keyExtractor}
				renderItem={renderCurrencies}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		marginTop: vs(15),
		marginHorizontal: s(26),
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),

		marginBottom: vs(30),
		textAlign: "center",
	},
	search: {
		marginBottom: vs(9),
	},

	scroll: {
		height: vs(100),
		flexGrow: 1,
	},
	scrollContent: {
		paddingTop: vs(9),
		paddingBottom: vs(50),
	},

	//
	iconContainer: {
		paddingHorizontal: s(25),
		alignItems: "center",
		justifyContent: "center",
	},
})
