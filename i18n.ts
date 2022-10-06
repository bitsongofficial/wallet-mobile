import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Languages } from 'constants/languages'

i18n
	.use(initReactI18next)
	.init({
		fallbackLng: Languages.En,
		debug: true,

		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		}
	})