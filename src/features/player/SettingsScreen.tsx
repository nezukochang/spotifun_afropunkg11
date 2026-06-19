import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { THEMES, type ThemeName } from '../../shared/theme/presets';
import { LOCALE_LABELS, type Locale } from '../../shared/i18n/translations';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { FloatUp, StaggeredEntry } from '../../shared/ui/Animations';
import { signOut } from '../../services/supabase/authService';
import { useAuthStore } from '../../stores/useAuthStore';
import { getCacheStatus, clearCache } from '../../services/offline/cacheService';
import { CacheStatus, AudioQuality, AppSettings } from '../../types';
import { APP_VERSION, SETTINGS_STORAGE_KEY, OFFLINE_CACHE_MAX_BYTES } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAmbient } from '../../services/audio/AmbientProvider';

function formatBytes(bytes: number): string {
    if (bytes === 0) { return '0 Mo'; }
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) { return `${mb.toFixed(0)} Mo`; }
    return `${(mb / 1024).toFixed(1)} Go`;
}

const PREMIUM_FEATURES = [
    { icon: '🎵', key: 'lossless' },
    { icon: '📥', key: 'unlimited' },
    { icon: '🚫', key: 'noads' },
    { icon: '🎨', key: 'themes' },
    { icon: '👥', key: 'social' },
    { icon: '⚡', key: 'early' },
];

const PREMIUM_LABELS: Record<string, Record<Locale, string>> = {
    lossless: { en: 'Lossless Audio', fr: 'Audio Sans Perte', ja: 'ロスレスオーディオ' },
    unlimited: { en: 'Unlimited Downloads', fr: 'Telechargements Illimites', ja: '無制限ダウンロード' },
    noads: { en: 'No Ads', fr: 'Sans Publicite', ja: '広告なし' },
    themes: { en: 'All Themes Unlocked', fr: 'Tous les Themes', ja: '全テーマ解放' },
    social: { en: 'Priority Social Features', fr: 'Fonctions Sociales Premium', ja: '優先ソーシャル機能' },
    early: { en: 'Early Access Features', fr: 'Acces Anticipe', ja: '早期アクセス機能' },
};

export const SettingsScreen = () => {
    const { user } = useAuthStore();
    const { colors, themeName, setTheme, mode, setMode } = useThemeStore();
    const { t, locale, setLocale } = useI18nStore();
    const { setAmbientEnabled: setAmbientPreference, isAmbientPlaying } = useAmbient();
    const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        audioQuality: 'normal',
        maxCacheBytes: OFFLINE_CACHE_MAX_BYTES,
        reduceAnimations: false,
        offlineMode: false,
        ambientEnabled: false,
    });
    const [showQualityPicker, setShowQualityPicker] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    const loadCache = useCallback(async () => {
        const status = await getCacheStatus();
        setCacheStatus(status);
    }, []);

    const loadSettings = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
            if (raw) { setSettings(prev => ({ ...prev, ...JSON.parse(raw) })); }
            const premium = await AsyncStorage.getItem('spotifun-afropunk_premium');
            if (premium === 'true') { setIsPremium(true); }
        } catch { /* ignore */ }
        loadCache();
    }, [loadCache]);

    useEffect(() => { loadSettings(); }, [loadSettings]);

    const saveSettings = async (updates: Partial<AppSettings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    };

    const handleClearCache = () => {
        Alert.alert(t.clearCache, t.clearCache + '?', [
            { text: t.cancel, style: 'cancel' },
            { text: t.delete, style: 'destructive', onPress: async () => { await clearCache(); loadCache(); } },
        ]);
    };

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) { Alert.alert(t.error, error.message); }
    };

    const handlePremium = async () => {
        setIsPremium(true);
        await AsyncStorage.setItem('spotifun-afropunk_premium', 'true');
        Alert.alert(t.premium, t.premiumFeatures + ' 🎉');
    };

    const QUALITY_OPTIONS: { value: AudioQuality; label: string; bitrate: string; clr: string }[] = [
        { value: 'low', label: 'LOW', bitrate: '64 kbps', clr: colors.accentEmerald },
        { value: 'normal', label: 'NORMAL', bitrate: '128 kbps', clr: colors.accentSecondary },
        { value: 'high', label: 'HIGH', bitrate: '320 kbps', clr: colors.accent },
    ];

    const cachePercent = cacheStatus ? Math.round((cacheStatus.totalSize / cacheStatus.maxSize) * 100) : 0;

    return (
        <AfroPunkBackground showSlideshow>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <FloatUp>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.white }]}>{t.settingsTitle}</Text>
                    </View>
                </FloatUp>

                {/* Profile */}
                <StaggeredEntry index={0}>
                    <GlassCard style={styles.profileCard} variant="gold" glow>
                        <View style={styles.profileRow}>
                            <View style={[styles.profileAvatar, { backgroundColor: colors.surfaceLight, borderColor: colors.glassBorder }]}>
                                <Text style={[styles.profileAvatarText, { color: colors.accentSecondary }]}>
                                    {user?.email?.[0]?.toUpperCase() || 'F'}
                                </Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.label, { color: colors.gray[400] }]}>{t.account}</Text>
                                <Text style={[styles.email, { color: colors.white }]}>{user?.email}</Text>
                            </View>
                            <View style={[styles.planBadge, { backgroundColor: isPremium ? colors.accentSecondary : colors.surfaceLight }]}>
                                <Text style={[styles.planBadgeText, { color: isPremium ? colors.void : colors.gray[400] }]}>
                                    {isPremium ? t.premium : t.free}
                                </Text>
                            </View>
                        </View>
                    </GlassCard>
                </StaggeredEntry>

                {/* Premium */}
                {!isPremium && (
                    <StaggeredEntry index={1}>
                        <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionDot, { backgroundColor: colors.accentSecondary }]} />
                                <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.premium}</Text>
                            </View>
                            <GlassCard style={styles.premiumCard} variant="gold" glow>
                                <Text style={[styles.premiumTitle, { color: colors.accentSecondary }]}>
                                    ✨ {t.upgradeToPremium}
                                </Text>
                                <Text style={[styles.premiumSubtitle, { color: colors.gray[300] }]}>
                                    {t.premiumSubtitle}
                                </Text>
                                <View style={styles.featureGrid}>
                                    {PREMIUM_FEATURES.map(f => (
                                        <View key={f.key} style={styles.featureItem}>
                                            <Text style={styles.featureIcon}>{f.icon}</Text>
                                            <Text style={[styles.featureText, { color: colors.white }]}>
                                                {PREMIUM_LABELS[f.key][locale]}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity style={[styles.premiumBtn, { backgroundColor: colors.accentSecondary }]} onPress={handlePremium} activeOpacity={0.8}>
                                    <Text style={[styles.premiumBtnText, { color: colors.void }]}>
                                        {t.getPremium} — $9.99/mo
                                    </Text>
                                </TouchableOpacity>
                            </GlassCard>
                        </View>
                    </StaggeredEntry>
                )}

                {/* Theme Picker */}
                <StaggeredEntry index={2}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accent }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.theme}</Text>
                        </View>
                        <TouchableOpacity style={styles.option} onPress={() => setShowThemePicker(!showThemePicker)} activeOpacity={0.7}>
                            <Text style={[styles.optionText, { color: colors.white }]}>{t.theme}</Text>
                            <Text style={[styles.optionValue, { color: colors.accentSecondary }]}>{THEMES[themeName]?.name}</Text>
                        </TouchableOpacity>
                        {showThemePicker && (
                            <Animated.View entering={FadeInUp.springify()}>
                                <GlassCard style={styles.themeGrid}>
                                    {(Object.keys(THEMES) as ThemeName[]).map(key => {
                                        const th = THEMES[key];
                                        const isActive = themeName === key;
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                style={[styles.themeOption, isActive && { borderColor: th.colors.accent, borderWidth: 2 }]}
                                                onPress={() => setTheme(key)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.themePreview}>
                                                    <View style={[styles.themeSwatch1, { backgroundColor: th.colors.accent }]} />
                                                    <View style={[styles.themeSwatch2, { backgroundColor: th.colors.accentSecondary }]} />
                                                    <View style={[styles.themeSwatch3, { backgroundColor: th.colors.accentTertiary }]} />
                                                </View>
                                                <Text style={styles.themeIcon}>{th.icon}</Text>
                                                <Text style={[styles.themeName, { color: isActive ? th.colors.accent : colors.gray[400] }]}>
                                                    {th.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </GlassCard>
                            </Animated.View>
                        )}
                    </View>
                </StaggeredEntry>

                {/* Brightness Mode */}
                <StaggeredEntry index={2.5}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accentEmerald }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.brightness}</Text>
                        </View>
                        <View style={styles.modeRow}>
                            {(['dark', 'mid', 'light'] as const).map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={[
                                        styles.modeBtn,
                                        mode === m && { backgroundColor: colors.accent, borderColor: colors.accent },
                                        mode !== m && { borderColor: colors.glassBorder },
                                    ]}
                                    onPress={() => setMode(m)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.modeIcon}>
                                        {m === 'dark' ? '🌙' : m === 'mid' ? '🌤️' : '☀️'}
                                    </Text>
                                    <Text style={[styles.modeLabel, { color: mode === m ? colors.void : colors.gray[400] }]}>
                                        {t[m]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </StaggeredEntry>

                {/* Language Picker */}
                <StaggeredEntry index={3}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accentTertiary }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.language}</Text>
                        </View>
                        <TouchableOpacity style={styles.option} onPress={() => setShowLangPicker(!showLangPicker)} activeOpacity={0.7}>
                            <Text style={[styles.optionText, { color: colors.white }]}>{t.language}</Text>
                            <Text style={[styles.optionValue, { color: colors.accentTertiary }]}>{LOCALE_LABELS[locale]}</Text>
                        </TouchableOpacity>
                        {showLangPicker && (
                            <Animated.View entering={FadeInUp.springify()}>
                                <GlassCard style={styles.langPicker}>
                                    {(Object.keys(LOCALE_LABELS) as Locale[]).map(l => (
                                        <TouchableOpacity
                                            key={l}
                                            style={[styles.langOption, locale === l && { backgroundColor: colors.glassActive }]}
                                            onPress={() => { setLocale(l); setShowLangPicker(false); }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.langFlag}>
                                                {l === 'en' ? '🇬🇧' : l === 'fr' ? '🇫🇷' : '🇯🇵'}
                                            </Text>
                                            <Text style={[styles.langLabel, { color: locale === l ? colors.accent : colors.white }]}>
                                                {LOCALE_LABELS[l]}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </GlassCard>
                            </Animated.View>
                        )}
                    </View>
                </StaggeredEntry>

                {/* Cache management */}
                <StaggeredEntry index={4}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionDot} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.storage}</Text>
                        </View>
                        <GlassCard style={styles.optionCard}>
                            <View style={styles.cacheInfo}>
                                <Text style={[styles.optionText, { color: colors.white }]}>{t.cacheSize}</Text>
                                <Text style={[styles.cacheValue, { color: colors.accentSecondary }]}>
                                    {cacheStatus ? formatBytes(cacheStatus.totalSize) : '--'} / {formatBytes(cacheStatus?.maxSize || OFFLINE_CACHE_MAX_BYTES)}
                                </Text>
                            </View>
                            <View style={styles.cacheBar}>
                                <Animated.View
                                    entering={FadeInUp.delay(300).springify()}
                                    style={[styles.cacheBarFill, { width: `${cachePercent}%`, backgroundColor: colors.accentSecondary }]}
                                />
                            </View>
                            <Text style={[styles.cacheMeta, { color: colors.gray[500] }]}>
                                {cacheStatus?.entryCount || 0} {t.tracks}
                            </Text>
                            <TouchableOpacity style={styles.clearBtn} onPress={handleClearCache} activeOpacity={0.7}>
                                <Text style={[styles.optionText, { color: colors.accent }]}>{t.clearCache}</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    </View>
                </StaggeredEntry>

                {/* Audio quality */}
                <StaggeredEntry index={5}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accentTertiary }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>{t.audioQuality}</Text>
                        </View>
                        <TouchableOpacity style={styles.option} onPress={() => setShowQualityPicker(!showQualityPicker)} activeOpacity={0.7}>
                            <Text style={[styles.optionText, { color: colors.white }]}>{t.audioQuality}</Text>
                            <Text style={[styles.optionValue, { color: colors.gray[400] }]}>{settings.audioQuality.toUpperCase()}</Text>
                        </TouchableOpacity>
                        {showQualityPicker && (
                            <Animated.View entering={FadeInUp.springify()}>
                                <GlassCard style={styles.qualityPicker}>
                                    {QUALITY_OPTIONS.map(opt => (
                                        <TouchableOpacity
                                            key={opt.value}
                                            style={[styles.qualityOption, settings.audioQuality === opt.value && { backgroundColor: colors.glassActive }]}
                                            onPress={() => { saveSettings({ audioQuality: opt.value }); setShowQualityPicker(false); }}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.qualityDot, { backgroundColor: opt.clr }]} />
                                            <Text style={[styles.qualityLabel, { color: settings.audioQuality === opt.value ? opt.clr : colors.white }]}>
                                                {opt.label}
                                            </Text>
                                            <Text style={[styles.qualityBitrate, { color: colors.gray[500] }]}>{opt.bitrate}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </GlassCard>
                            </Animated.View>
                        )}
                    </View>
                </StaggeredEntry>

                {/* Toggles */}
                <StaggeredEntry index={6}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accent }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>PREFERENCES</Text>
                        </View>
                        <View style={styles.option}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.optionText, { color: colors.white }]}>{t.offlineMode}</Text>
                            </View>
                            <Switch
                                value={settings.offlineMode}
                                onValueChange={(val) => saveSettings({ offlineMode: val })}
                                trackColor={{ false: colors.gray[600], true: colors.accentSecondary }}
                                thumbColor={colors.white}
                            />
                        </View>
                        <View style={[styles.option, { borderBottomWidth: 0 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.optionText, { color: colors.white }]}>Ambient Music</Text>
                                <Text style={[styles.optionLabel, { color: colors.gray[500] }]}>
                                    {isAmbientPlaying ? 'Soft background sound is playing' : 'Soft background sound'}
                                </Text>
                            </View>
                            <Switch
                                value={settings.ambientEnabled}
                                onValueChange={async (val) => {
                                    await saveSettings({ ambientEnabled: val });
                                    await setAmbientPreference(val);
                                }}
                                trackColor={{ false: colors.gray[600], true: colors.accentEmerald }}
                                thumbColor={colors.white}
                            />
                        </View>
                    </View>
                </StaggeredEntry>

                {/* Future concepts */}
                <StaggeredEntry index={6.5}>
                    <View style={[styles.section, { paddingHorizontal: THEME.spacing.xl }]}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accentSecondary }]} />
                            <Text style={[styles.sectionTitle, { color: colors.gray[400] }]}>AFROFUTURE LAB</Text>
                        </View>
                        <GlassCard style={styles.conceptsCard} variant="gold">
                            {[
                                'Mood journeys: playlists that follow calm, focus, dance, or night-drive energy.',
                                'Griot mode: short artist stories before a track starts.',
                                'Community rituals: live rooms around Afropunk scenes and local collectives.',
                            ].map((idea, index) => (
                                <View key={idea} style={[styles.conceptRow, index === 2 && { borderBottomWidth: 0 }]}>
                                    <Text style={[styles.conceptIndex, { color: colors.accentSecondary }]}>0{index + 1}</Text>
                                    <Text style={[styles.conceptText, { color: colors.gray[200] }]}>{idea}</Text>
                                </View>
                            ))}
                        </GlassCard>
                    </View>
                </StaggeredEntry>

                {/* App info */}
                <StaggeredEntry index={7}>
                    <View style={styles.option}>
                        <Text style={[styles.optionText, { color: colors.white }]}>{t.version}</Text>
                        <Text style={[styles.optionValue, { color: colors.gray[400] }]}>{APP_VERSION}</Text>
                    </View>
                </StaggeredEntry>

                {/* Sign out */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut} activeOpacity={0.7}>
                    <GlassCard variant="accent" glow>
                        <Text style={[styles.logoutText, { color: colors.accent }]}>{t.logout}</Text>
                    </GlassCard>
                </TouchableOpacity>
            </ScrollView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: THEME.spacing.xxl },
    header: { padding: THEME.spacing.xl, paddingTop: THEME.spacing.xxl },
    title: { fontSize: THEME.typography.sizes.xl, fontWeight: '900', letterSpacing: 4 },

    profileCard: { padding: THEME.spacing.lg, marginHorizontal: THEME.spacing.xl, marginBottom: THEME.spacing.xxl },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    profileAvatar: {
        width: 44, height: 44, borderRadius: 22,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.md, borderWidth: 1,
    },
    profileAvatarText: { fontSize: 18, fontWeight: '800' },
    profileInfo: { flex: 1 },
    label: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
    email: { fontSize: 15, marginTop: 4, fontWeight: '600' },
    planBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    planBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    section: { marginBottom: THEME.spacing.xl },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.sm },
    sectionDot: { width: 6, height: 6, borderRadius: 3, marginRight: THEME.spacing.sm, transform: [{ rotate: '45deg' }] },
    sectionTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },

    optionCard: { padding: THEME.spacing.lg },
    option: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: THEME.spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    optionText: { fontWeight: '700', letterSpacing: 1, fontSize: 13 },
    optionValue: { fontWeight: '700', fontSize: 13 },
    optionLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },

    // Premium
    premiumCard: { padding: THEME.spacing.lg },
    premiumTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
    premiumSubtitle: { fontSize: 13, marginBottom: THEME.spacing.lg },
    featureGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: THEME.spacing.lg },
    featureItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: THEME.spacing.sm },
    featureIcon: { fontSize: 16, marginRight: 6 },
    featureText: { fontSize: 12, fontWeight: '700' },
    premiumBtn: { padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center' },
    premiumBtnText: { fontWeight: '900', fontSize: 14, letterSpacing: 1 },

    // Theme picker
    themeGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: THEME.spacing.sm, justifyContent: 'space-between' },
    themeOption: {
        width: '48%', alignItems: 'center', padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    themePreview: { flexDirection: 'row', marginBottom: THEME.spacing.xs },
    themeSwatch1: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 2 },
    themeSwatch2: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 2 },
    themeSwatch3: { width: 16, height: 16, borderRadius: 8, marginHorizontal: 2 },
    themeIcon: { fontSize: 20, marginBottom: 2 },
    themeName: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },

    // Language picker
    langPicker: { padding: THEME.spacing.sm },
    langOption: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.md, paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md, marginBottom: 2,
    },
    langFlag: { fontSize: 18, marginRight: THEME.spacing.md },
    langLabel: { fontWeight: '800', fontSize: 14 },

    // Cache
    cacheInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: THEME.spacing.sm },
    cacheValue: { fontWeight: '800', fontSize: 13 },
    cacheBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: THEME.spacing.xs },
    cacheBarFill: { height: '100%', borderRadius: 3 },
    cacheMeta: { fontSize: 10, marginBottom: THEME.spacing.md },
    clearBtn: {
        paddingVertical: THEME.spacing.sm, alignItems: 'center',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: THEME.spacing.md,
    },

    // Quality picker
    qualityPicker: { marginTop: THEME.spacing.sm, padding: THEME.spacing.sm },
    qualityOption: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.md, paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md, marginBottom: 2,
    },
    qualityDot: { width: 8, height: 8, borderRadius: 4, marginRight: THEME.spacing.md },
    qualityLabel: { fontWeight: '800', fontSize: 13, flex: 1 },
    qualityBitrate: { fontSize: 11 },

    // Concepts
    conceptsCard: { padding: THEME.spacing.lg },
    conceptRow: {
        flexDirection: 'row',
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    conceptIndex: { width: 32, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    conceptText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '600' },

    // Brightness mode
    modeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: THEME.spacing.sm },
    modeBtn: {
        flex: 1, alignItems: 'center', paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md, borderWidth: 1,
    },
    modeIcon: { fontSize: 20, marginBottom: 4 },
    modeLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },

    logoutBtn: { paddingVertical: THEME.spacing.lg, paddingHorizontal: THEME.spacing.xl, marginTop: THEME.spacing.xl },
    logoutText: { fontWeight: '900', fontSize: 13, letterSpacing: 3, textAlign: 'center' },
});
