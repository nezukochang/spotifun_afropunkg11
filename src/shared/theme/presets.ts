// ═══════════════════════════════════════════════════════════════
// Spotifun Afropunk Theme Presets
// Each theme is a complete color system with accents, surfaces, and glows
// ═══════════════════════════════════════════════════════════════

export interface ThemeColors {
    void: string;
    surface: string;
    surfaceLight: string;
    transparent: string;
    white: string;
    accent: string;
    accentSecondary: string;
    accentTertiary: string;
    accentEmerald: string;
    glass: string;
    glassBorder: string;
    glassHover: string;
    glassActive: string;
    gray: Record<string, string>;
    error: string;
    success: string;
    warning: string;
    pattern: string;
    patternStrong: string;
    glowAccent: string;
    glowSecondary: string;
}

// ─── 1. AFROPUNK (default) ──────────────────────────────────
const afroPunk: ThemeColors = {
    void: '#0D0B09',
    surface: '#16130F',
    surfaceLight: '#1F1B16',
    transparent: 'transparent',
    white: '#F5F0E8',
    accent: '#D4784C',
    accentSecondary: '#C9A46C',
    accentTertiary: '#8B6E5C',
    accentEmerald: '#6B8F71',
    glass: 'rgba(255, 255, 255, 0.035)',
    glassBorder: 'rgba(255, 255, 255, 0.06)',
    glassHover: 'rgba(255, 255, 255, 0.06)',
    glassActive: 'rgba(212, 120, 76, 0.1)',
    gray: {
        50: '#F5F0E8', 100: '#E8DFD2', 200: '#D4C4AA', 300: '#B09B7A',
        400: '#8A7A62', 500: '#6B5F4A', 600: '#514636', 700: '#382F24',
        800: '#221D15', 900: '#16130F',
    },
    error: '#C45C4C',
    success: '#6B8F71',
    warning: '#C9A46C',
    pattern: 'rgba(201, 164, 108, 0.03)',
    patternStrong: 'rgba(201, 164, 108, 0.06)',
    glowAccent: 'rgba(212, 120, 76, 0.25)',
    glowSecondary: 'rgba(201, 164, 108, 0.2)',
};

// ─── 2. NEON NIGHTS ─────────────────────────────────────────
const neonNights: ThemeColors = {
    void: '#05050F',
    surface: '#0D0D1F',
    surfaceLight: '#161633',
    transparent: 'transparent',
    white: '#FFFFFF',
    accent: '#00F5D4',
    accentSecondary: '#F72585',
    accentTertiary: '#7209B7',
    accentEmerald: '#00F5D4',
    glass: 'rgba(0, 245, 212, 0.04)',
    glassBorder: 'rgba(0, 245, 212, 0.1)',
    glassHover: 'rgba(0, 245, 212, 0.08)',
    glassActive: 'rgba(0, 245, 212, 0.15)',
    gray: {
        50: '#F0F8FF', 100: '#E0EEFF', 200: '#B8D4F0', 300: '#8EAED0',
        400: '#6B8BB5', 500: '#4F6D95', 600: '#364D70', 700: '#1E3350',
        800: '#101E35', 900: '#080F1A',
    },
    error: '#F72585',
    success: '#00F5D4',
    warning: '#FFD60A',
    pattern: 'rgba(0, 245, 212, 0.04)',
    patternStrong: 'rgba(0, 245, 212, 0.08)',
    glowAccent: 'rgba(0, 245, 212, 0.35)',
    glowSecondary: 'rgba(247, 37, 133, 0.3)',
};

// ─── 3. SAHARA GOLD ─────────────────────────────────────────
const saharaGold: ThemeColors = {
    void: '#0F0D08',
    surface: '#1A1610',
    surfaceLight: '#26201A',
    transparent: 'transparent',
    white: '#FFF8E7',
    accent: '#E8A317',
    accentSecondary: '#D4651E',
    accentTertiary: '#8B6914',
    accentEmerald: '#2D8B46',
    glass: 'rgba(232, 163, 23, 0.04)',
    glassBorder: 'rgba(232, 163, 23, 0.1)',
    glassHover: 'rgba(232, 163, 23, 0.08)',
    glassActive: 'rgba(232, 163, 23, 0.15)',
    gray: {
        50: '#FFF8E7', 100: '#F5E6C8', 200: '#D4BC8A', 300: '#B09A6A',
        400: '#8C7A50', 500: '#6E5E3A', 600: '#504228', 700: '#352C1A',
        800: '#1E1810', 900: '#0F0D08',
    },
    error: '#D4651E',
    success: '#2D8B46',
    warning: '#E8A317',
    pattern: 'rgba(232, 163, 23, 0.05)',
    patternStrong: 'rgba(232, 163, 23, 0.1)',
    glowAccent: 'rgba(232, 163, 23, 0.35)',
    glowSecondary: 'rgba(212, 101, 30, 0.3)',
};

// ─── 4. LAGOS SUNSET ────────────────────────────────────────
const lagosSunset: ThemeColors = {
    void: '#0F0808',
    surface: '#1A1010',
    surfaceLight: '#261818',
    transparent: 'transparent',
    white: '#FFF5F0',
    accent: '#FF6B35',
    accentSecondary: '#FF1493',
    accentTertiary: '#FF8C42',
    accentEmerald: '#2ECC71',
    glass: 'rgba(255, 107, 53, 0.04)',
    glassBorder: 'rgba(255, 107, 53, 0.1)',
    glassHover: 'rgba(255, 107, 53, 0.08)',
    glassActive: 'rgba(255, 107, 53, 0.15)',
    gray: {
        50: '#FFF5F0', 100: '#FFE0D0', 200: '#FFB899', 300: '#D48A6A',
        400: '#A86A4F', 500: '#7D4F3A', 600: '#553528', 700: '#352018',
        800: '#1E1210', 900: '#0F0808',
    },
    error: '#FF1493',
    success: '#2ECC71',
    warning: '#FF8C42',
    pattern: 'rgba(255, 107, 53, 0.05)',
    patternStrong: 'rgba(255, 107, 53, 0.1)',
    glowAccent: 'rgba(255, 107, 53, 0.35)',
    glowSecondary: 'rgba(255, 20, 147, 0.3)',
};

// ─── 5. FOREST SPIRIT ───────────────────────────────────────
const forestSpirit: ThemeColors = {
    void: '#060F0A',
    surface: '#0D1A12',
    surfaceLight: '#15261C',
    transparent: 'transparent',
    white: '#F0FFF4',
    accent: '#00C853',
    accentSecondary: '#00BFA5',
    accentTertiary: '#4CAF50',
    accentEmerald: '#00C853',
    glass: 'rgba(0, 200, 83, 0.04)',
    glassBorder: 'rgba(0, 200, 83, 0.1)',
    glassHover: 'rgba(0, 200, 83, 0.08)',
    glassActive: 'rgba(0, 200, 83, 0.15)',
    gray: {
        50: '#F0FFF4', 100: '#C8E6C9', 200: '#A5D6A7', 300: '#81C784',
        400: '#66BB6A', 500: '#4CAF50', 600: '#388E3C', 700: '#1B5E20',
        800: '#0D2E10', 900: '#060F0A',
    },
    error: '#FF5252',
    success: '#00C853',
    warning: '#FFD740',
    pattern: 'rgba(0, 200, 83, 0.05)',
    patternStrong: 'rgba(0, 200, 83, 0.1)',
    glowAccent: 'rgba(0, 200, 83, 0.35)',
    glowSecondary: 'rgba(0, 191, 165, 0.3)',
};

// ─── Theme Registry ──────────────────────────────────────────
export const THEMES: Record<string, { name: string; colors: ThemeColors; icon: string }> = {
    afropunk: { name: 'AFROPUNK', colors: afroPunk, icon: '🔥' },
    neon: { name: 'NEON NIGHTS', colors: neonNights, icon: '💜' },
    sahara: { name: 'SAHARA GOLD', colors: saharaGold, icon: '✨' },
    sunset: { name: 'LAGOS SUNSET', colors: lagosSunset, icon: '🌅' },
    forest: { name: 'FOREST SPIRIT', colors: forestSpirit, icon: '🌿' },
};

export type ThemeName = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeName = 'afropunk';
