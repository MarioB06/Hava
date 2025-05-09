import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en/translation.json';
import de from './locales/de/translation.json';

i18n
    .use(initReactI18next)
    .init({
        lng: Localization.locale.includes('de') ? 'de' : 'en',
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            de: { translation: de }
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
