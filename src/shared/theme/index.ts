import { COLORS } from './colors';

export const THEME = {
    colors: COLORS,
    spacing: {
        xxs: 2,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,
    },
    typography: {
        fontFamily: 'System',
        weights: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extraBold: '800',
            black: '900',
        },
        sizes: {
            xxs: 9,
            xs: 11,
            sm: 13,
            md: 16,
            lg: 20,
            xl: 28,
            xxl: 40,
            hero: 56,
        },
    },
    borderRadius: {
        xs: 4,
        sm: 6,
        md: 10,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    shadows: {
        glow: {
            shadowColor: COLORS.glowAccent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
            elevation: 8,
        },
        goldGlow: {
            shadowColor: COLORS.glowGold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 6,
        },
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
    },
};

export type Theme = typeof THEME;
