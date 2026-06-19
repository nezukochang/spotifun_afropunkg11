import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView,
    Alert, TextInput, Modal, Image,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { StaggeredEntry, FloatUp, SpringBounce } from '../../shared/ui/Animations';
import { FriendsList } from '../../shared/ui/FriendsList';
import { ChatPanel } from '../../shared/ui/ChatPanel';
import { ArtistManager } from '../../shared/ui/ArtistManager';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import {
    getUserPlaylists, createPlaylist, deletePlaylist,
    getLikedTrackIds, getRecentlyPlayed,
} from '../../services/catalog/userLibraryService';
import { Playlist, AfropunkTrack } from '../../types';

export const LibraryScreen = () => {
    const { user } = useAuthStore();
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const playTrack = usePlayerStore(s => s.playTrack);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [likedCount, setLikedCount] = useState(0);
    const [recentTracks, setRecentTracks] = useState<AfropunkTrack[]>([]);
    const [activeSection, setActiveSection] = useState<'playlists' | 'friends' | 'artists'>('playlists');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [creating, setCreating] = useState(false);

    const loadData = useCallback(async () => {
        if (!user) { return; }
        const { data } = await getUserPlaylists(user.id);
        if (data) { setPlaylists(data); }
        const likedIds = await getLikedTrackIds(user.id);
        setLikedCount(likedIds.length);
        const recent = await getRecentlyPlayed(user.id, 6);
        setRecentTracks(recent);
    }, [user]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCreatePlaylist = async () => {
        if (!user || !newPlaylistName.trim()) { return; }
        setCreating(true);
        await createPlaylist(user.id, newPlaylistName.trim());
        setNewPlaylistName('');
        setShowCreateModal(false);
        setCreating(false);
        loadData();
    };

    const handleDeletePlaylist = (playlist: Playlist) => {
        Alert.alert(`${t.delete}`, `${t.delete} "${playlist.name}"?`, [
            { text: t.cancel, style: 'cancel' },
            { text: t.delete, style: 'destructive', onPress: async () => { await deletePlaylist(playlist.id); loadData(); } },
        ]);
    };

    const handleRenamePlaylist = (playlist: Playlist) => {
        Alert.alert(t.rename, `${t.rename} "${playlist.name}"`, [{ text: 'OK' }]);
    };

    // ─── Recently played item ────────────────────────────────
    const renderRecentTrack = ({ item }: { item: AfropunkTrack }) => {
        const artworkUri = item.artwork as string | undefined;
        return (
            <TouchableOpacity
                style={styles.recentItem}
                onPress={() => playTrack(item as any, recentTracks as any, 0)}
                activeOpacity={0.8}
            >
                <View style={styles.recentArtwork}>
                    {artworkUri ? (
                        <Image source={{ uri: artworkUri }} style={styles.recentImg} />
                    ) : (
                        <View style={styles.recentFallback}>
                            <Text style={styles.recentFallbackIcon}>♫</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <AfroPunkBackground>
            <View style={styles.container}>
                {/* Profile header */}
                <FloatUp>
                    <View style={styles.profileHeader}>
                        <View style={[styles.profileAvatar, { backgroundColor: colors.surfaceLight, borderColor: colors.glassBorder }]}>
                            <Text style={[styles.profileAvatarText, { color: colors.accentSecondary }]}>
                                {user?.email?.[0]?.toUpperCase() || 'F'}
                            </Text>
                        </View>
                        <Text style={[styles.profileEmail, { color: colors.white }]}>{user?.email || 'Spotifun User'}</Text>
                        <View style={styles.profileStats}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.accentSecondary }]}>{playlists.length}</Text>
                                <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{t.playlists}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.accent }]}>{likedCount}</Text>
                                <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{t.liked}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: colors.accentTertiary }]}>{recentTracks.length}</Text>
                                <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{t.tracks}</Text>
                            </View>
                        </View>
                    </View>
                </FloatUp>

                {/* Recently played */}
                {recentTracks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionDot, { backgroundColor: colors.accentSecondary }]} />
                            <Text style={[styles.sectionLabel, { color: colors.gray[400] }]}>{t.recentlyPlayedShort}</Text>
                        </View>
                        <FlatList
                            data={recentTracks}
                            renderItem={renderRecentTrack}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recentList}
                        />
                    </View>
                )}

                {/* Tabs */}
                <View style={styles.tabs}>
                    {(['playlists', 'artists', 'friends'] as const).map(section => (
                        <TouchableOpacity
                            key={section}
                            onPress={() => setActiveSection(section)}
                            style={[styles.tab, activeSection === section && styles.activeTab]}
                        >
                            <Text style={[styles.tabLabel, { color: activeSection === section ? colors.white : colors.gray[500] }]}>
                                {section === 'playlists' ? t.playlists : section === 'artists' ? t.artists : t.tribe}
                            </Text>
                            {activeSection === section && <View style={[styles.tabIndicator, { backgroundColor: colors.accentSecondary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {activeSection === 'playlists' ? (
                    <FlatList
                        data={playlists}
                        ListHeaderComponent={() => (
                            <View>
                                {/* Liked tracks card */}
                                <SpringBounce>
                                    <TouchableOpacity style={styles.favoriteCard}>
                                        <GlassCard style={styles.favoriteContent} variant="gold" glow>
                                            <View style={styles.favoriteIcon}>
                                                <Text style={styles.heartIcon}>♥</Text>
                                            </View>
                                            <Text style={styles.favoriteText}>{t.likedTracks}</Text>
                                            <Text style={styles.countText}>{likedCount} {t.likedTotal}</Text>
                                        </GlassCard>
                                    </TouchableOpacity>
                                </SpringBounce>

                                {/* Create playlist button */}
                                <TouchableOpacity
                                    style={styles.createBtn}
                                    onPress={() => setShowCreateModal(true)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.createBtnIcon}>
                                        <Text style={styles.createBtnPlus}>+</Text>
                                    </View>
                                    <Text style={styles.createBtnText}>{t.createPlaylistBtn}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        renderItem={({ item, index }) => (
                            <StaggeredEntry index={index}>
                                <TouchableOpacity
                                    style={styles.playlistItem}
                                    onLongPress={() => {
                                        Alert.alert(item.name, t.whatToDo, [
                                            { text: t.rename, onPress: () => handleRenamePlaylist(item) },
                                            { text: t.delete, style: 'destructive', onPress: () => handleDeletePlaylist(item) },
                                            { text: t.cancel, style: 'cancel' },
                                        ]);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.playlistIcon}>
                                        <Text style={styles.playlistIconText}>♫</Text>
                                    </View>
                                    <View style={styles.playlistInfo}>
                                        <Text style={[styles.playlistName, { color: colors.white }]}>{item.name}</Text>
                                        <Text style={[styles.playlistMeta, { color: colors.gray[500] }]}>
                                            {item.trackIds?.length || 0} {t.trackCount}
                                        </Text>
                                    </View>
                                    <Text style={styles.playlistArrow}>›</Text>
                                </TouchableOpacity>
                            </StaggeredEntry>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listPadding}
                        ListEmptyComponent={
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyDiamond}>◆</Text>
                                <Text style={[styles.emptyTitle, { color: colors.gray[300] }]}>{t.noPlaylists}</Text>
                                <Text style={[styles.emptyHint, { color: colors.gray[500] }]}>{t.noPlaylistsHint}</Text>
                            </View>
                        }
                    />
                ) : activeSection === 'artists' ? (
                    <ScrollView contentContainerStyle={styles.listPadding}>
                        <ArtistManager />
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={styles.listPadding}>
                        <TouchableOpacity
                            style={[styles.chatBtn, { borderColor: colors.glassBorder, backgroundColor: colors.glass }]}
                            onPress={() => setShowChat(true)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.chatIcon}>💬</Text>
                            <Text style={[styles.chatBtnText, { color: colors.accentSecondary }]}>{t.chat}</Text>
                        </TouchableOpacity>
                        <FriendsList />
                    </ScrollView>
                )}

                {/* Create playlist modal */}
                <Modal visible={showCreateModal} transparent animationType="fade" onRequestClose={() => setShowCreateModal(false)}>
                    <View style={styles.modalOverlay}>
                        <Animated.View entering={SlideInUp.springify().damping(16)}>
                            <GlassCard style={styles.modalCard} variant="accent" glow>
                                <Text style={styles.modalTitle}>{t.newPlaylist}</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder={t.playlistNamePlaceholder}
                                    placeholderTextColor={THEME.colors.gray[600]}
                                    value={newPlaylistName}
                                    onChangeText={setNewPlaylistName}
                                    autoFocus
                                />
                                <View style={styles.modalActions}>
                                    <TouchableOpacity
                                        style={styles.modalBtn}
                                        onPress={() => { setShowCreateModal(false); setNewPlaylistName(''); }}
                                    >
                                        <Text style={styles.modalBtnText}>{t.cancel}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalBtn, styles.modalBtnPrimary]}
                                        onPress={handleCreatePlaylist}
                                        disabled={creating || !newPlaylistName.trim()}
                                    >
                                        <Text style={[styles.modalBtnText, { color: THEME.colors.white }]}>
                                            {creating ? '...' : t.createPlaylist}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    </View>
                </Modal>

                {/* Chat panel */}
                <ChatPanel visible={showChat} onClose={() => setShowChat(false)} />
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

    // Profile header
    profileHeader: {
        alignItems: 'center', paddingVertical: THEME.spacing.xl,
        paddingHorizontal: THEME.spacing.xl,
    },
    profileAvatar: {
        width: 64, height: 64, borderRadius: 32,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: THEME.spacing.sm, borderWidth: 2,
    },
    profileAvatarText: { fontSize: 26, fontWeight: '800' },
    profileEmail: {
        fontSize: 15, fontWeight: '700', marginBottom: THEME.spacing.md,
        textAlign: 'center',
    },
    profileStats: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: THEME.borderRadius.lg, paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.md,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: '800' },
    statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
    statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.06)' },

    // Sections
    section: { marginBottom: THEME.spacing.md },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: THEME.spacing.xl, marginBottom: THEME.spacing.sm },
    sectionDot: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: THEME.colors.accentGold,
        marginRight: THEME.spacing.sm, transform: [{ rotate: '45deg' }],
    },
    sectionLabel: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '800', letterSpacing: 2 },

    // Recently played
    recentList: { paddingHorizontal: THEME.spacing.xl },
    recentItem: { width: 105, marginRight: THEME.spacing.md },
    recentArtwork: {
        width: 105, height: 105, borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden', marginBottom: 6,
    },
    recentImg: { width: 105, height: 105 },
    recentFallback: {
        width: 105, height: 105,
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center', alignItems: 'center',
    },
    recentFallbackIcon: { color: THEME.colors.accentGold, fontSize: 24 },
    recentTitle: { color: THEME.colors.white, fontSize: 11, fontWeight: '600' },

    // Tabs
    tabs: { flexDirection: 'row', paddingHorizontal: THEME.spacing.xl, marginBottom: THEME.spacing.lg },
    tab: { marginRight: THEME.spacing.xl, paddingBottom: 10, position: 'relative' },
    activeTab: {},
    tabLabel: { color: THEME.colors.gray[500], fontWeight: '800', fontSize: 12, letterSpacing: 2 },
    activeTabLabel: { color: THEME.colors.white },
    tabIndicator: {
        position: 'absolute', bottom: 0, left: '10%', right: '10%',
        height: 3, backgroundColor: THEME.colors.accentGold, borderRadius: 2,
    },

    // Favorites
    favoriteCard: { marginBottom: THEME.spacing.lg },
    favoriteContent: { alignItems: 'center', paddingVertical: THEME.spacing.xl },
    favoriteIcon: { marginBottom: THEME.spacing.sm },
    heartIcon: { color: THEME.colors.accent, fontSize: 28 },
    favoriteText: {
        color: THEME.colors.white, fontWeight: '800',
        fontSize: 14, letterSpacing: 3, textAlign: 'center',
    },
    countText: { color: THEME.colors.accentGold, textAlign: 'center', marginTop: 6, fontSize: 11, fontWeight: '700' },

    // Create button
    createBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: THEME.spacing.md, marginBottom: THEME.spacing.lg,
        backgroundColor: THEME.colors.glass, borderRadius: THEME.borderRadius.lg,
        borderWidth: 1, borderColor: THEME.colors.glassBorder,
    },
    createBtnIcon: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: 'rgba(255, 184, 0, 0.15)',
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.sm,
    },
    createBtnPlus: { color: THEME.colors.accentGold, fontSize: 18, fontWeight: '700' },
    createBtnText: { color: THEME.colors.white, fontSize: 12, fontWeight: '800', letterSpacing: 2 },

    // Playlist items
    playlistItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    },
    playlistIcon: {
        width: 40, height: 40, borderRadius: THEME.borderRadius.md,
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.md,
    },
    playlistIconText: { color: THEME.colors.accentGold, fontSize: 16 },
    playlistInfo: { flex: 1 },
    playlistName: { color: THEME.colors.white, fontWeight: '700', fontSize: 15 },
    playlistMeta: { color: THEME.colors.gray[500], fontSize: 11, marginTop: 3 },
    playlistArrow: { color: THEME.colors.gray[500], fontSize: 22, fontWeight: '300' },
    listPadding: { paddingHorizontal: THEME.spacing.xl },

    // Modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', padding: THEME.spacing.xxl,
    },
    modalCard: { padding: THEME.spacing.xl },
    modalTitle: {
        color: THEME.colors.white, fontSize: 16, fontWeight: '900',
        letterSpacing: 3, marginBottom: THEME.spacing.lg,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md, color: THEME.colors.white, fontSize: 15,
        borderWidth: 1, borderColor: THEME.colors.glassBorder, marginBottom: THEME.spacing.lg,
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalBtn: { paddingVertical: 10, paddingHorizontal: 20, marginLeft: THEME.spacing.md },
    modalBtnPrimary: {
        backgroundColor: THEME.colors.accent, borderRadius: THEME.borderRadius.md,
    },
    modalBtnText: { color: THEME.colors.gray[400], fontWeight: '800', fontSize: 12, letterSpacing: 2 },

    // Chat button
    chatBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: THEME.spacing.md, marginBottom: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg, borderWidth: 1,
    },
    chatIcon: { fontSize: 18, marginRight: THEME.spacing.sm },
    chatBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },

    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: THEME.spacing.xxxl * 2,
        paddingHorizontal: THEME.spacing.xl,
    },
    emptyDiamond: { fontSize: 40, color: THEME.colors.accentGold, opacity: 0.5, marginBottom: THEME.spacing.md },
    emptyTitle: { fontSize: THEME.typography.sizes.lg, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginBottom: THEME.spacing.sm },
    emptyHint: { fontSize: THEME.typography.sizes.sm, textAlign: 'center', lineHeight: 20, opacity: 0.8 },
});
