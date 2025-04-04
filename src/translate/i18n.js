import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translations from './languages'

const i18nConfig = {
    resources: translations,
    fallbackLng: 'pt-BR',
}

i18next.use(LanguageDetector).use(initReactI18next).init(i18nConfig)

export default i18next