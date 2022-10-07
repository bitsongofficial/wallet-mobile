import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { useStore } from "hooks"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { StyledInput, Title } from "../atoms"
import { LanguageItem } from "../moleculs"
import { LanguageData, Languages } from "constants/languages"
import { ILang } from "screens/Profile/type"
import { Icon2 } from "components/atoms"
import { s, vs } from "react-native-size-matters"
import { useTranslation } from "react-i18next"

type Props = {
	close(): void
}

export default observer<Props>(({ close }) => {
	const { t } = useTranslation()
	const { settings } = useStore()

	// --------- Search ---------
	const input = useMemo(() => new InputHandler(), [])

	const filtered = useMemo<Languages[]>(() => {
		if (input.value) {
			const lowerCase = input.value.toLowerCase()
			return Object.values(Languages).filter(code => LanguageData[code].name.toLowerCase().includes(lowerCase))
		} else {
			return Object.values(Languages)
		}
	}, [input.value])

	// ------- FlatList ----------

	const setLanguage = useCallback((lang: Languages) => {
		settings.setLanguage(lang)
		close()
	}, [])

	const keyExtractor = (code: Languages) => code
	const renderLanguage = useCallback<ListRenderItem<Languages>>(
		({item}) => (
			<LanguageItem
				value={LanguageData[item]}
				isActive={item === settings.language}
				onPress={() => setLanguage(item)}
			/>
		),
		[settings.language],
	)

	return (
		<View style={styles.container}>
			<Title style={styles.title}>{t("SelectLanguage")}</Title>
			<StyledInput
				placeholder={t("SearchLanguage")}
				style={styles.search}
				value={input.value}
				onChangeText={input.set}
				Right={
					<View style={styles.iconContainer}>
						<Icon2 name="magnifying_glass" stroke={hexAlpha(COLOR.White, 20)} size={21} />
					</View>
				}
			/>
			<BottomSheetFlatList
				data={filtered}
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				keyExtractor={keyExtractor}
				renderItem={renderLanguage}
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
