import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { Languages } from 'constants/languages'
const imports: {[k in Languages]?: any} = {
	[Languages.En]: {
		translation: import('./locales/en/translation.json')
	},
	[Languages.It]: {
		translation: import('./locales/it/translation.json')
	}
}

i18n
	.use(initReactI18next)
	.use(resourcesToBackend((language, namespace, callback) => {
		imports[language as Languages][namespace]
			.then((resources: any) => {
				callback(null, resources)
			})
			.catch((error: any) => {
				callback(error, null)
			})
	}))
	.init({
		supportedLngs: Object.values(Languages),
		lng: Languages.En,
		fallbackLng: Languages.En,
		debug: true,
		ns: "translation",

		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	})