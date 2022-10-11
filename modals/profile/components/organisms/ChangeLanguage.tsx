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
import { Select } from "modals/general/organisms"
import { HORIZONTAL_WRAPPER } from "utils/constants"

type Props = {
	close(): void
}

export default observer<Props>(({ close }) => {
	const { t } = useTranslation()
	const { settings } = useStore()

	const setLanguage = useCallback((lang: Languages) => {
		settings.setLanguage(lang)
		close()
	}, [])

	const keyExtractor = (code: Languages) => code

	return (
		<View style={styles.container}>
			<Select
				title={t("SelectLanguage")}
				items={Object.values(Languages)}
				active={settings.language}
				keyExtractor={keyExtractor}
				onGray={true}
				labelExtractor={item => LanguageData[item as Languages].name}
				searchCriteria={(item, search) => LanguageData[item as Languages].name.toLowerCase().includes(search.toLowerCase())}
				onPress={setLanguage}
			></Select>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		marginTop: vs(15),
		paddingHorizontal: HORIZONTAL_WRAPPER,
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
