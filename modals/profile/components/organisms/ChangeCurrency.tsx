import { useCallback, useMemo } from "react"
import { Dimensions, ListRenderItem, StyleSheet, Text, View } from "react-native"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { observer } from "mobx-react-lite"
import { useStore } from "hooks"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { StyledInput, Title } from "../atoms"
import { CurrencyItem } from "../moleculs"
import { ICurrency } from "screens/Profile/type"
import { Icon2 } from "components/atoms"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { Select } from "modals/general/organisms"
import { Currencies, CurrenciesData } from "constants/currencies"

type Props = {
	close(): void
}

export default observer<Props>(({ close }) => {
	const { t } = useTranslation()
	const { settings } = useStore()

	const setCurrency = useCallback((currency: Currencies) => {
		settings.setCurrency(currency)
		close()
	}, [])


	return (
		<View style={styles.container}>
			<Select
				title={t("SelectCurrency")}
				items={Object.values(Currencies)}
				searchCriteria={(item, search) => CurrenciesData[item].title.toLowerCase().includes(search.toLowerCase())}
				onPress={setCurrency}
				onGray={true}
				active={settings.currency}
				keyExtractor={(item: Currencies) => item}
				labelExtractor={item => CurrenciesData[item].title}
			></Select>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		marginTop: vs(15),
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),

		marginBottom: vs(30),
		textAlign: "center",
	},
	currencyName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(13),
		lineHeight: s(50),
		color: COLOR.RoyalBlue3,
		marginRight: s(42),
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
