import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    RefreshControl, ScrollView, Alert, Modal,
} from 'react-native';
import Animated, {
    FadeInDown,
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    interpolate, Easing, withSequence,
} from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { StaggeredEntry, FloatUp } from '../../shared/ui/Animations';
import { getCatalog, AfroTrack } from '../../services/catalog/catalogService';
import { getRecentlyPlayed, getUserPlaylists, addTrackToPlaylist } from '../../services/catalog/userLibraryService';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { AfropunkTrack, Playlist } from '../../types';

const CARD_W = 160;
const LOGO = require('../../assets/images/afropunk_logo.png');

export const HomeScreen = () => {
    const { user } = useAuthStore();
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const playTrack = usePlayerStore(s => s.playTrack);
    const addToQueue = usePlayerStore(s => s.addToQueue);

    const [tracks, setTracks] = useState<AfroTrack[]>([]);
    const [recentTracks, setRecentTracks] = useState<AfropunkTrack[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<AfroTrack | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

    // Animated hero glow
    const heroGlow = useSharedValue(0);
    useEffect(() => {
        heroGlow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            ), -1, false,
        );
    }, [heroGlow]);
    const heroGlowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(heroGlow.value, [0, 1], [0.1, 0.3]),
    }));

    const loadCatalog = useCallback(async () => {
        try {
            const catalog = await getCatalog();
            setTracks(catalog);
            if (user) {
                const recent = await getRecentlyPlayed(user.id, 8);
                setRecentTracks(recent);
            }
        } catch (e) {
            console.warn('[Home] Failed to load catalog:', e);
        }
    }, [user]);

    useEffect(() => { loadCatalog(); }, [loadCatalog]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadCatalog();
        setRefreshing(false);
    }, [loadCatalog]);

    const genres = Array.from(new Set(tracks.map(t => t.genre)));

    const handlePlayTrack = useCallback((track: AfropunkTrack, genreTracks: AfroTrack[]) => {
        const idx = genreTracks.findIndex(t => t.id === track.id);
        const fullTrack: any = { ...track, url: track.url || '' };
        playTrack(fullTrack, genreTracks as any, idx >= 0 ? idx : 0);
    }, [playTrack]);

    const handleAddToQueue = useCallback((track: AfroTrack) => {
        addToQueue(track);
    }, [addToQueue]);

    const handleLongPressTrack = useCallback(async (track: AfroTrack) => {
        setSelectedTrack(track);
        if (user) {
            const { data } = await getUserPlaylists(user.id);
            setPlaylists(data || []);
        }
        Alert.alert(track.title ?? '', t.whatToDo, [
            {
                text: t.addToQueue,
                onPress: () => addToQueue(track),
            },
            {
                text: t.addTracks,
                onPress: () => setShowPlaylistPicker(true),
            },
            { text: t.cancel, style: 'cancel', onPress: () => setSelectedTrack(null) },
        ]);
    }, [addToQueue, user, t]);

    // ─── Hero header with logo ────────────────────────────────
    const renderHeader = () => (
        <FloatUp>
            <View style={styles.heroContainer}>
                {/* Animated glow behind logo */}
                <Animated.View style={[styles.heroGlow, { backgroundColor: colors.accent }, heroGlowStyle]} />
                <Image source={LOGO} style={styles.heroLogo} resizeMode="contain" />
                <Text style={[styles.heroTitle, { color: colors.white }]}>SPOTIFUN AFROPUNK</Text>
                <Text style={[styles.heroSubtitle, { color: colors.accentSecondary }]}>AFROPUNK SOUND SYSTEM</Text>
                <View style={styles.heroDivider}>
                    <View style={[styles.heroDiamond, { backgroundColor: colors.accentSecondary }]} />
                    <View style={[styles.heroLine, { backgroundColor: colors.glassBorder }]} />
                    <View style={[styles.heroDiamond, { backgroundColor: colors.accentSecondary }]} />
                </View>
            </View>
        </FloatUp>
    );

    // ─── Recently played item ────────────────────────────────
    const renderRecentItem = ({ item, index }: { item: AfropunkTrack; index: number }) => {
        const artworkUri = item.artwork as string | undefined;
        return (
            <StaggeredEntry index={index}>
                <TouchableOpacity
                    style={styles.recentCard}
                    onPress={() => playTrack(item as any, recentTracks as any, 0)}
                    onLongPress={() => handleLongPressTrack(item as any)}
                    activeOpacity={0.8}
                >
                    <View style={styles.recentArtwork}>
                        {artworkUri ? (
                            <Image source={{ uri: artworkUri }} style={styles.recentImg} />
                        ) : (
                            <View style={[styles.recentFallback, { backgroundColor: colors.surfaceLight }]}>
                                <Text style={[styles.recentFallbackIcon, { color: colors.accentSecondary }]}>♫</Text>
                            </View>
                        )}
                        <View style={styles.recentOverlay} />
                    </View>
                    <Text style={[styles.recentTitle, { color: colors.white }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.recentArtist, { color: colors.gray[400] }]} numberOfLines={1}>{item.artist}</Text>
                </TouchableOpacity>
            </StaggeredEntry>
        );
    };

    // ─── Genre track item ────────────────────────────────────
    const renderTrackItem = (track: AfroTrack, genreTracks: AfroTrack[], index: number) => (
        <StaggeredEntry index={index}>
            <TouchableOpacity
                onPress={() => handlePlayTrack(track, genreTracks)}
                onLongPress={() => handleLongPressTrack(track)}
                activeOpacity={0.8}
            >
                <GlassCard style={styles.trackCard} variant="default">
                    <View style={styles.trackArtworkWrap}>
                        {track.artwork ? (
                            <Image source={{ uri: track.artwork as string }} style={styles.artwork} />
                        ) : (
                            <View style={[styles.artwork, styles.artFallback, { backgroundColor: colors.surfaceLight }]}>
                                <Text style={[styles.fallbackIcon, { color: colors.accentSecondary }]}>♫</Text>
                            </View>
                        )}
                        <View style={styles.trackGradientOverlay} />
                    </View>
                    <Text style={[styles.trackTitle, { color: colors.white }]} numberOfLines={1}>{track.title}</Text>
                    <Text style={[styles.trackArtist, { color: colors.gray[400] }]} numberOfLines={1}>{track.artist}</Text>
                    <View style={styles.trackMeta}>
                        <Text style={[styles.trackGenre, { color: colors.accentSecondary }]}>{track.genre}</Text>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        </StaggeredEntry>
    );

    // ─── Genre pill tabs ─────────────────────────────────────
    const renderGenrePills = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genrePillContainer}
            style={styles.genrePillScroll}
        >
            <TouchableOpacity
                style={[styles.genrePill, !activeGenre && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                onPress={() => setActiveGenre(null)}
            >
                <Text style={[styles.genrePillText, { color: colors.gray[400] }, !activeGenre && { color: colors.white }]}>
                    {t.allGenres.toUpperCase()}
                </Text>
            </TouchableOpacity>
            {genres.map(g => (
                <TouchableOpacity
                    key={g}
                    style={[styles.genrePill, activeGenre === g && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                    onPress={() => setActiveGenre(activeGenre === g ? null : g)}
                >
                    <Text style={[styles.genrePillText, { color: colors.gray[400] }, activeGenre === g && { color: colors.white }]}>
                        {g.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const filteredGenres = activeGenre ? [activeGenre] : genres;

    const isError = tracks.length === 0 && !refreshing && genres.length === 0;

    return (
        <AfroPunkBackground showSlideshow>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.accentSecondary}
                        colors={[colors.accentSecondary]}
                    />
                }
            >
                {renderHeader()}
                {renderGenrePills()}

                {isError ? (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyIcon}>🌍</Text>
                        <Text style={[styles.emptyTitle, { color: colors.gray[300] }]}>{t.noTracksFound}</Text>
                        <Text style={[styles.emptyHint, { color: colors.gray[500] }]}>{t.retryConnection}</Text>
                    </View>
                ) : (
                    <>
                        {recentTracks.length > 0 && (
                            <View style={styles.section}>
                                <Animated.View entering={FadeInDown.delay(100)}>
                                    <View style={styles.sectionHeader}>
                                        <View style={[styles.sectionDot, { backgroundColor: colors.accentSecondary }]} />
                                        <Text style={[styles.sectionTitle, { color: colors.gray[300] }]}>{t.recentlyPlayed}</Text>
                                    </View>
                                </Animated.View>
                                <FlatList
                                    data={recentTracks}
                                    renderItem={renderRecentItem}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.recentList}
                                />
                            </View>
                        )}

                        {filteredGenres.map(genre => {
                            const genreTracks = tracks.filter(t => t.genre === genre);
                            if (genreTracks.length === 0) { return null; }
                            return (
                                <View key={genre} style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <View style={[styles.sectionDot, { backgroundColor: colors.accentTertiary }]} />
                                        <Text style={[styles.sectionTitle, { color: colors.gray[300] }]}>{genre.toUpperCase()}</Text>
                                        <Text style={[styles.sectionCount, { color: colors.gray[500] }]}>{genreTracks.length} {t.tracks}</Text>
                                    </View>
                                    <FlatList
                                        data={genreTracks}
                                        renderItem={({ item, index }) => renderTrackItem(item, genreTracks, index)}
                                        keyExtractor={item => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.trackList}
                                    />
                                </View>
                            );
                        })}
                    </>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Playlist picker modal */}
            <Modal visible={showPlaylistPicker} transparent animationType="fade" onRequestClose={() => { setShowPlaylistPicker(false); setSelectedTrack(null); }}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.white }]}>{t.addTracks.toUpperCase()}</Text>
                        {playlists.length === 0 ? (
                            <Text style={[styles.modalEmpty, { color: colors.gray[400] }]}>{t.noPlaylists}</Text>
                        ) : (
                            playlists.map(pl => (
                                <TouchableOpacity
                                    key={pl.id}
                                    style={[styles.playlistRow, { borderBottomColor: colors.glassBorder }]}
                                    onPress={async () => {
                                        if (selectedTrack) {
                                            await addTrackToPlaylist(pl.id, selectedTrack.id as string);
                                            Alert.alert('', `"${selectedTrack.title ?? ''}" → ${pl.name}`);
                                        }
                                        setShowPlaylistPicker(false);
                                        setSelectedTrack(null);
                                    }}
                                >
                                    <Text style={[styles.playlistRowText, { color: colors.white }]}>{pl.name}</Text>
                                    <Text style={[styles.playlistRowCount, { color: colors.gray[500] }]}>{pl.trackIds?.length || 0} {t.tracks}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                        <TouchableOpacity style={styles.modalCancel} onPress={() => { setShowPlaylistPicker(false); setSelectedTrack(null); }}>
                            <Text style={[styles.modalCancelText, { color: colors.accent }]}>{t.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Hero
    heroContainer: {
        paddingHorizontal: THEME.spacing.xl,
        paddingTop: THEME.spacing.xxl,
        paddingBottom: THEME.spacing.lg,
        alignItems: 'center',
    },
    heroGlow: {
        position: 'absolute', width: 140, height: 140, borderRadius: 70,
        top: 20,
    },
    heroLogo: { width: 80, height: 80, borderRadius: 16, marginBottom: THEME.spacing.sm },
    heroTitle: {
        fontSize: THEME.typography.sizes.hero,
        fontWeight: '900', letterSpacing: 8, textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: THEME.typography.sizes.xs,
        fontWeight: '700', letterSpacing: 4, marginTop: THEME.spacing.xs,
    },
    heroDivider: {
        flexDirection: 'row', alignItems: 'center',
        marginTop: THEME.spacing.md, width: 180,
    },
    heroLine: { flex: 1, height: 1 },
    heroDiamond: { width: 8, height: 8, transform: [{ rotate: '45deg' }] },

    // Genre pills
    genrePillScroll: { maxHeight: 44 },
    genrePillContainer: { paddingHorizontal: THEME.spacing.xl, gap: 8 },
    genrePill: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: THEME.colors.glass,
        borderWidth: 1, borderColor: THEME.colors.glassBorder,
    },
    genrePillText: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },

    // Sections
    section: { marginTop: THEME.spacing.xl },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: THEME.spacing.xl, marginBottom: THEME.spacing.md,
    },
    sectionDot: {
        width: 6, height: 6, borderRadius: 3,
        marginRight: THEME.spacing.sm, transform: [{ rotate: '45deg' }],
    },
    sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 3 },
    sectionCount: { marginLeft: 'auto', fontSize: 10, fontWeight: '700' },

    // Recently played
    recentList: { paddingHorizontal: THEME.spacing.xl },
    recentCard: { width: 115, marginRight: THEME.spacing.md },
    recentArtwork: {
        width: 115, height: 115,
        borderRadius: THEME.borderRadius.lg, overflow: 'hidden', marginBottom: 6,
    },
    recentImg: { width: 115, height: 115 },
    recentFallback: {
        width: 115, height: 115, justifyContent: 'center', alignItems: 'center',
    },
    recentFallbackIcon: { fontSize: 28 },
    recentOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 10, 15, 0.2)',
    },
    recentTitle: { fontWeight: '700', fontSize: 12 },
    recentArtist: { fontSize: 10, marginTop: 2 },

    // Track cards
    trackList: { paddingHorizontal: THEME.spacing.xl },
    trackCard: { width: CARD_W, marginRight: THEME.spacing.md, padding: THEME.spacing.sm },
    trackArtworkWrap: {
        width: '100%', aspectRatio: 1,
        borderRadius: THEME.borderRadius.md, overflow: 'hidden', marginBottom: THEME.spacing.sm,
    },
    artwork: { width: '100%', height: '100%' },
    artFallback: { justifyContent: 'center', alignItems: 'center' },
    fallbackIcon: { fontSize: 28 },
    trackGradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 10, 15, 0.15)',
    },
    trackTitle: { fontWeight: '700', fontSize: 13 },
    trackArtist: { fontSize: 11, marginTop: 2 },
    trackMeta: { marginTop: 4 },
    trackGenre: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },

    // Empty / error state
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: THEME.spacing.xxxl * 2,
        paddingHorizontal: THEME.spacing.xl,
    },
    emptyIcon: { fontSize: 56, marginBottom: THEME.spacing.md, opacity: 0.7 },
    emptyTitle: {
        fontSize: THEME.typography.sizes.lg,
        fontWeight: '800',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    emptyHint: {
        fontSize: THEME.typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.8,
    },

    // Playlist picker modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', padding: THEME.spacing.xxl,
    },
    modalCard: {
        borderRadius: THEME.borderRadius.xl, padding: THEME.spacing.xl,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    modalTitle: {
        fontSize: 13, fontWeight: '900', letterSpacing: 3,
        marginBottom: THEME.spacing.lg, textAlign: 'center',
    },
    modalEmpty: {
        textAlign: 'center', fontSize: 13, marginBottom: THEME.spacing.lg,
    },
    playlistRow: {
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    playlistRowText: { fontSize: 14, fontWeight: '700' },
    playlistRowCount: { fontSize: 11 },
    modalCancel: { marginTop: THEME.spacing.lg, alignItems: 'center' },
    modalCancelText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
});
