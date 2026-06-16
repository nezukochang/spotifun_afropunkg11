import { COLORS } from './colors';

export const THEME = {
    colors: COLORS,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    typography: {
        fontFamily: 'System',
        weights: {
            regular: '400',
            bold: '700',
            extraBold: '800',
            black: '900',
        },
        sizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 32,
            xxl: 48,
        },
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 16,
        full: 9999,
    },
};

export type Theme = typeof THEME;
