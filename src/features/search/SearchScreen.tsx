import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
    Image, ActivityIndicator, Keyboard, Alert, Modal,
} from 'react-native';
import Animated, {
    FadeInUp,
    useSharedValue, useAnimatedStyle,
    withTiming, interpolate,
} from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { StaggeredEntry, SpringBounce } from '../../shared/ui/Animations';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { searchTracks, getRecentSearches, addRecentSearch, clearRecentSearches } from '../../services/catalog/searchService';
import { getUserPlaylists, addTrackToPlaylist } from '../../services/catalog/userLibraryService';
import { AfropunkTrack, RecentSearch, Artist, Playlist } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ tracks: AfropunkTrack[]; artists: Artist[] }>({ tracks: [], artists: [] });
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'tracks' | 'artists'>('tracks');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const { user } = useAuthStore();
    const playTrack = usePlayerStore(s => s.playTrack);
    const addToQueue = usePlayerStore(s => s.addToQueue);
    const [selectedTrack, setSelectedTrack] = useState<AfropunkTrack | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

    // Animated focus glow
    const focusVal = useSharedValue(0);
    const focusStyle = useAnimatedStyle(() => ({
        borderColor: interpolate(focusVal.value, [0, 1], [0.08, 0.4]) as any,
        shadowOpacity: focusVal.value * 0.4,
    }));

    useEffect(() => {
        focusVal.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
    }, [focusVal, isFocused]);

    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        getRecentSearches().then(setRecentSearches);
    }, []);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults({ tracks: [], artists: [] });
            return;
        }
        setLoading(true);
        searchTracks(debouncedQuery).then(r => {
            setResults({ tracks: r.tracks, artists: r.artists });
            setLoading(false);
        });
    }, [debouncedQuery]);

    const handleSubmit = useCallback(() => {
        if (query.trim()) {
            addRecentSearch(query.trim()).then(() => {
                getRecentSearches().then(setRecentSearches);
            });
        }
        Keyboard.dismiss();
    }, [query]);

    const handleRecentTap = useCallback((q: string) => setQuery(q), []);
    const handleClearRecent = useCallback(() => {
        clearRecentSearches().then(() => setRecentSearches([]));
    }, []);

    const handlePlayTrack = useCallback((track: AfropunkTrack, allTracks: AfropunkTrack[]) => {
        const idx = allTracks.findIndex(t => t.id === track.id);
        playTrack(track as any, allTracks as any, idx >= 0 ? idx : 0);
    }, [playTrack]);

    const handleLongPressTrack = useCallback(async (track: AfropunkTrack) => {
        setSelectedTrack(track);
        if (user) {
            const { data } = await getUserPlaylists(user.id);
            setPlaylists(data || []);
        }
        Alert.alert(track.title ?? '', t.whatToDo, [
            { text: t.addToQueue, onPress: () => addToQueue(track as any) },
            { text: t.addTracks, onPress: () => setShowPlaylistPicker(true) },
            { text: t.cancel, style: 'cancel', onPress: () => setSelectedTrack(null) },
        ]);
    }, [addToQueue, user, t]);

    // ─── Track result ────────────────────────────────────────
    const renderTrack = ({ item, index }: { item: AfropunkTrack; index: number }) => {
        const artworkUri = item.artwork as string | undefined;
        return (
            <StaggeredEntry index={index}>
                <TouchableOpacity
                    style={styles.trackItem}
                    onPress={() => handlePlayTrack(item, results.tracks)}
                    onLongPress={() => handleLongPressTrack(item)}
                    activeOpacity={0.7}
                >
                    <View style={styles.trackArtwork}>
                        {artworkUri ? (
                            <Image source={{ uri: artworkUri }} style={styles.artworkImg} />
                        ) : (
                            <View style={styles.artworkFallback}>
                                <Text style={styles.artFallbackIcon}>♫</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.trackInfo}>
                        <Text style={[styles.trackTitle, { color: colors.white }]} numberOfLines={1}>{item.title}</Text>
                        <Text style={[styles.trackArtist, { color: colors.gray[400] }]} numberOfLines={1}>{item.artist}</Text>
                    </View>
                    <View style={[styles.genreTag, { backgroundColor: colors.glass }]}>
                        <Text style={[styles.trackGenre, { color: colors.accentSecondary }]}>{item.genre}</Text>
                    </View>
                </TouchableOpacity>
            </StaggeredEntry>
        );
    };

    // ─── Artist result ──────────────────────────────────────
    const renderArtist = ({ item, index }: { item: Artist; index: number }) => (
        <StaggeredEntry index={index}>
            <TouchableOpacity style={styles.artistItem} activeOpacity={0.7}>
                <View style={[styles.artistAvatar, { backgroundColor: colors.surfaceLight, borderColor: colors.glassBorder }]}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={styles.artistAvatarImg} />
                    ) : (
                        <Text style={[styles.artistAvatarText, { color: colors.accentSecondary }]}>{item.name[0]?.toUpperCase()}</Text>
                    )}
                </View>
                <View style={styles.artistInfo}>
                    <Text style={[styles.artistName, { color: colors.white }]}>{item.name}</Text>
                    <Text style={[styles.artistGenre, { color: colors.gray[400] }]}>{item.genres.join(', ')}</Text>
                </View>
            </TouchableOpacity>
        </StaggeredEntry>
    );

    const showResults = results.tracks.length > 0 || results.artists.length > 0;
    const showRecent = !showResults && !query && recentSearches.length > 0;

    return (
        <AfroPunkBackground>
            <View style={styles.container}>
                {/* Header */}
                <Animated.View entering={FadeInUp} style={styles.header}>
                    <Text style={[styles.title, { color: colors.white }]}>{t.search}</Text>
                </Animated.View>

                {/* Search input with glow */}
                <Animated.View style={[styles.searchWrap, focusStyle]}>
                    <GlassCard style={styles.searchCard}>
                        <TextInput
                            ref={inputRef}
                            style={[styles.input, { color: colors.white }]}
                            placeholder={t.searchPlaceholder}
                            placeholderTextColor={colors.gray[600]}
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={handleSubmit}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoCapitalize="none"
                            returnKeyType="search"
                            clearButtonMode="while-editing"
                        />
                    </GlassCard>
                </Animated.View>

                {loading && (
                    <ActivityIndicator color={colors.accentSecondary} style={{ marginTop: THEME.spacing.lg }} />
                )}

                {/* Recent searches */}
                {showRecent && (
                    <View style={styles.recentSection}>
                        <View style={styles.recentHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.gray[400] }]}>{t.recentSearches}</Text>
                            <TouchableOpacity onPress={handleClearRecent}>
                                <Text style={[styles.clearBtn, { color: colors.accent }]}>{t.clear}</Text>
                            </TouchableOpacity>
                        </View>
                        {recentSearches.map((s, i) => (
                            <StaggeredEntry key={i} index={i}>
                                <TouchableOpacity style={styles.recentItem} onPress={() => handleRecentTap(s.query)}>
                                    <View style={styles.recentDot} />
                                    <Text style={styles.recentText}>{s.query}</Text>
                                </TouchableOpacity>
                            </StaggeredEntry>
                        ))}
                    </View>
                )}

                {/* Results tabs */}
                {showResults && (
                    <View style={styles.tabs}>
                        {(['tracks', 'artists'] as const).map(section => (
                            <TouchableOpacity
                                key={section}
                                onPress={() => setActiveSection(section)}
                                style={[styles.tab, activeSection === section && styles.activeTab]}
                            >
                                <Text style={[styles.tabLabel, activeSection === section && styles.activeTabLabel, { color: activeSection === section ? colors.white : colors.gray[500] }]}>
                                    {section === 'tracks' ? `${t.tracksTab} (${results.tracks.length})` : `${t.artistsTab} (${results.artists.length})`}
                                </Text>
                                {activeSection === section && <View style={styles.tabIndicator} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Results list */}
                {showResults && activeSection === 'tracks' && (
                    <FlatList
                        data={results.tracks}
                        renderItem={renderTrack}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {showResults && activeSection === 'artists' && (
                    <FlatList
                        data={results.artists}
                        renderItem={renderArtist}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Empty state */}
                {!showResults && !showRecent && !loading && query.length > 0 && (
                    <SpringBounce>
                        <View style={styles.emptyState}>
                            <View style={styles.emptyGlow} />
                            <Text style={styles.emptyDiamond}>◆</Text>
                            <Text style={[styles.emptyText, { color: colors.gray[300] }]}>{t.noResultsFound}</Text>
                            <Text style={[styles.emptyHint, { color: colors.gray[500] }]}>{t.tryDifferent}</Text>
                        </View>
                    </SpringBounce>
                )}

                {/* Playlist picker modal */}
                <Modal visible={showPlaylistPicker} transparent animationType="fade" onRequestClose={() => { setShowPlaylistPicker(false); setSelectedTrack(null); }}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>
                            <Text style={[styles.modalTitle, { color: colors.white }]}>{t.addTracks}</Text>
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
            </View>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: THEME.spacing.xl, paddingTop: THEME.spacing.xxl },
    title: {
        fontSize: THEME.typography.sizes.xl, fontWeight: '900',
        color: THEME.colors.white, letterSpacing: 4,
    },

    // Search
    searchWrap: {
        marginHorizontal: THEME.spacing.xl, borderRadius: THEME.borderRadius.lg,
        borderWidth: 1.5, shadowColor: THEME.colors.accentGold,
        shadowOffset: { width: 0, height: 0 }, shadowRadius: 12, elevation: 4,
    },
    searchCard: { padding: 0 },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md, paddingHorizontal: THEME.spacing.lg,
        color: THEME.colors.white, fontSize: 15,
    },

    // Recent
    recentSection: { marginTop: THEME.spacing.xl, paddingHorizontal: THEME.spacing.xl },
    recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.md },
    sectionLabel: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '800', letterSpacing: 2 },
    clearBtn: { color: THEME.colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: THEME.spacing.sm },
    recentDot: {
        width: 5, height: 5, borderRadius: 3,
        backgroundColor: THEME.colors.accentGold, opacity: 0.5,
        marginRight: THEME.spacing.md, transform: [{ rotate: '45deg' }],
    },
    recentText: { color: THEME.colors.gray[300], fontSize: 14 },

    // Tabs
    tabs: { flexDirection: 'row', paddingHorizontal: THEME.spacing.xl, marginTop: THEME.spacing.lg, marginBottom: THEME.spacing.md },
    tab: { marginRight: THEME.spacing.xl, paddingBottom: 10, position: 'relative' },
    activeTab: {},
    tabLabel: { color: THEME.colors.gray[500], fontWeight: '800', fontSize: 11, letterSpacing: 2 },
    activeTabLabel: { color: THEME.colors.white },
    tabIndicator: {
        position: 'absolute', bottom: 0, left: '10%', right: '10%',
        height: 3, backgroundColor: THEME.colors.accentGold,
        borderRadius: 2,
    },

    // Track items
    listContent: { paddingHorizontal: THEME.spacing.xl, paddingBottom: THEME.spacing.xxl },
    trackItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.sm,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    trackArtwork: {
        width: 46, height: 46, borderRadius: THEME.borderRadius.md,
        overflow: 'hidden', marginRight: THEME.spacing.md,
    },
    artworkImg: { width: 46, height: 46 },
    artworkFallback: {
        width: 46, height: 46,
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center', alignItems: 'center',
    },
    artFallbackIcon: { color: THEME.colors.accentGold, fontSize: 16 },
    trackInfo: { flex: 1 },
    trackTitle: { color: THEME.colors.white, fontWeight: '600', fontSize: 14 },
    trackArtist: { color: THEME.colors.gray[400], fontSize: 11, marginTop: 2 },
    genreTag: {
        paddingHorizontal: 8, paddingVertical: 3,
        backgroundColor: THEME.colors.glass,
        borderRadius: THEME.borderRadius.sm,
    },
    trackGenre: { color: THEME.colors.accentGold, fontSize: 9, fontWeight: '800', letterSpacing: 1 },

    // Artist items
    artistItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.sm,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    artistAvatar: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.md, borderWidth: 1,
        borderColor: THEME.colors.glassBorder,
    },
    artistAvatarImg: { width: 46, height: 46, borderRadius: 23 },
    artistAvatarText: { color: THEME.colors.accentGold, fontSize: 18, fontWeight: '800' },
    artistInfo: { flex: 1 },
    artistName: { color: THEME.colors.white, fontWeight: '600', fontSize: 14 },
    artistGenre: { color: THEME.colors.gray[400], fontSize: 11, marginTop: 2 },

    // Empty
    emptyState: { alignItems: 'center', marginTop: THEME.spacing.xxxl, paddingHorizontal: THEME.spacing.xl },
    emptyGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: THEME.colors.accentGold,
        opacity: 0.06,
        top: -40,
    },
    emptyDiamond: {
        fontSize: 40,
        color: THEME.colors.accentGold,
        opacity: 0.5,
        marginBottom: THEME.spacing.md,
    },
    emptyText: { fontSize: 15, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: THEME.spacing.sm },
    emptyHint: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

    // Playlist picker modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', padding: THEME.spacing.xxl,
    },
    modalCard: {
        borderRadius: THEME.borderRadius.xl, padding: THEME.spacing.xl,
        borderWidth: 1,
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
    playlistRowText: { fontSize: 14, fontWeight: '700', color: THEME.colors.white },
    playlistRowCount: { fontSize: 11, color: THEME.colors.gray[500] },
    modalCancel: { marginTop: THEME.spacing.lg, alignItems: 'center' },
    modalCancelText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
});
