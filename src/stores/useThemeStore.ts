import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, DEFAULT_THEME, type ThemeName, type ThemeColors } from '../shared/theme/presets';

const THEME_KEY = 'spotifun-afropunk_active_theme';
const MODE_KEY = 'spotifun-afropunk_theme_mode';
export type ThemeMode = 'dark' | 'mid' | 'light';

// Transform colors based on brightness mode
function applyMode(colors: ThemeColors, mode: ThemeMode): ThemeColors {
    if (mode === 'dark') { return colors; }

    if (mode === 'mid') {
        return {
            ...colors,
            void: '#1A1A24',
            surface: '#24243A',
            surfaceLight: '#2E2E48',
            glass: colors.glass.replace('0.04', '0.06'),
            glassBorder: colors.glassBorder.replace('0.08', '0.12'),
            gray: {
                ...colors.gray,
                300: '#B8B0C8',
                400: '#9A92AE',
                500: '#7C7494',
                600: '#5E567A',
                700: '#403860',
                800: '#2A2248',
                900: '#1A1A24',
            },
        };
    }

    // Light mode
    return {
        ...colors,
        void: '#F5F3F0',
        surface: '#FFFFFF',
        surfaceLight: '#FAFAF8',
        white: '#1A1A2E',
        glass: 'rgba(0, 0, 0, 0.03)',
        glassBorder: 'rgba(0, 0, 0, 0.08)',
        glassHover: 'rgba(0, 0, 0, 0.05)',
        glassActive: colors.glassActive.replace('0.12', '0.08'),
        gray: {
            50: '#1A1A2E',
            100: '#2A2A40',
            200: '#4A4A60',
            300: '#6A6A80',
            400: '#8A8A9E',
            500: '#AAAAB8',
            600: '#D0D0D8',
            700: '#E8E8EC',
            800: '#F0F0F4',
            900: '#F8F8FA',
        },
        pattern: colors.pattern.replace('0.04', '0.06'),
        patternStrong: colors.patternStrong.replace('0.08', '0.12'),
    };
}

interface ThemeState {
    themeName: ThemeName;
    mode: ThemeMode;
    colors: ThemeColors;
    setTheme: (name: ThemeName) => void;
    setMode: (mode: ThemeMode) => void;
    loadTheme: () => Promise<void>;
}

const computeColors = (name: ThemeName, mode: ThemeMode): ThemeColors => {
    const base = THEMES[name]?.colors || THEMES[DEFAULT_THEME].colors;
    return applyMode(base, mode);
};

export const useThemeStore = create<ThemeState>((set) => ({
    themeName: DEFAULT_THEME,
    mode: 'dark',
    colors: THEMES[DEFAULT_THEME].colors,

    setTheme: (name: ThemeName) => {
        if (THEMES[name]) {
            const mode = useThemeStore.getState().mode;
            set({ themeName: name, colors: computeColors(name, mode) });
            AsyncStorage.setItem(THEME_KEY, name).catch(() => {});
        }
    },

    setMode: (mode: ThemeMode) => {
        const name = useThemeStore.getState().themeName;
        set({ mode, colors: computeColors(name, mode) });
        AsyncStorage.setItem(MODE_KEY, mode).catch(() => {});
    },

    loadTheme: async () => {
        try {
            const [savedTheme, savedMode] = await Promise.all([
                AsyncStorage.getItem(THEME_KEY),
                AsyncStorage.getItem(MODE_KEY),
            ]);
            const themeName = (savedTheme && THEMES[savedTheme]) ? savedTheme as ThemeName : DEFAULT_THEME;
            const mode = (savedMode as ThemeMode) || 'dark';
            set({ themeName, mode, colors: computeColors(themeName, mode) });
        } catch {}
    },
}));

export const getThemeColors = (): ThemeColors => useThemeStore.getState().colors;
