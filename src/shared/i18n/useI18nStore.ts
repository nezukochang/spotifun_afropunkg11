import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, type Locale, type TranslationStrings } from './translations';

const LOCALE_KEY = 'spotifun-afropunk_locale';

interface I18nState {
    locale: Locale;
    t: TranslationStrings;
    setLocale: (locale: Locale) => void;
    loadLocale: () => Promise<void>;
}

export const useI18nStore = create<I18nState>((set) => ({
    locale: 'en',
    t: TRANSLATIONS.en,

    setLocale: (locale: Locale) => {
        set({ locale, t: TRANSLATIONS[locale] });
        AsyncStorage.setItem(LOCALE_KEY, locale).catch(() => {});
    },

    loadLocale: async () => {
        try {
            const saved = await AsyncStorage.getItem(LOCALE_KEY);
            if (saved && TRANSLATIONS[saved as Locale]) {
                set({ locale: saved as Locale, t: TRANSLATIONS[saved as Locale] });
            }
        } catch {}
    },
}));

// Non-hook helper
export const getTranslations = (): TranslationStrings => useI18nStore.getState().t;
