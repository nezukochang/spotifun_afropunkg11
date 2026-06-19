import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Modal, TextInput, Alert,
} from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { THEME } from '../theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../i18n/useI18nStore';
import { GlassCard } from './GlassCard';
import { StaggeredEntry } from './Animations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ARTISTS_KEY = 'spotifun-afropunk_local_artists';

interface LocalArtist {
    id: string;
    name: string;
    genres: string[];
    trackIds: string[];
    createdAt: string;
}

const DEMO_ARTISTS: LocalArtist[] = [
    {
        id: 'demo-a1',
        name: 'Neon Ancestors',
        genres: ['Cyber-Griot', 'Afro-Punk'],
        trackIds: ['1', '5', '6'],
        createdAt: new Date().toISOString(),
    },
    {
        id: 'demo-a2',
        name: 'Digital Griot',
        genres: ['Tribal-Tech'],
        trackIds: ['2'],
        createdAt: new Date().toISOString(),
    },
];

export const ArtistManager = () => {
    const { colors } = useThemeStore();
    const { t } = useI18nStore();

    const [artists, setArtists] = useState<LocalArtist[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newGenres, setNewGenres] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => { loadArtists(); }, []);

    const loadArtists = async () => {
        try {
            const raw = await AsyncStorage.getItem(ARTISTS_KEY);
            const saved: LocalArtist[] = raw ? JSON.parse(raw) : [];
            setArtists(saved.length > 0 ? saved : DEMO_ARTISTS);
        } catch {
            setArtists(DEMO_ARTISTS);
        }
    };

    const saveArtists = async (list: LocalArtist[]) => {
        try {
            await AsyncStorage.setItem(ARTISTS_KEY, JSON.stringify(list));
        } catch { /* ignore */ }
    };

    const handleCreate = async () => {
        if (!newName.trim()) { return; }
        setCreating(true);
        const artist: LocalArtist = {
            id: `artist-${Date.now()}`,
            name: newName.trim(),
            genres: newGenres.split(',').map(g => g.trim()).filter(Boolean),
            trackIds: [],
            createdAt: new Date().toISOString(),
        };
        const updated = [artist, ...artists];
        setArtists(updated);
        await saveArtists(updated);
        setNewName('');
        setNewGenres('');
        setShowCreateModal(false);
        setCreating(false);
    };

    const handleDelete = (artist: LocalArtist) => {
        Alert.alert(t.delete, `${t.delete} "${artist.name}"?`, [
            { text: t.cancel, style: 'cancel' },
            {
                text: t.delete, style: 'destructive', onPress: async () => {
                    const updated = artists.filter(a => a.id !== artist.id);
                    setArtists(updated);
                    await saveArtists(updated);
                },
            },
        ]);
    };

    const renderArtist = ({ item, index }: { item: LocalArtist; index: number }) => (
        <StaggeredEntry index={index}>
            <TouchableOpacity
                style={styles.artistItem}
                onLongPress={() => handleDelete(item)}
                activeOpacity={0.8}
            >
                <View style={[styles.artistAvatar, { backgroundColor: colors.surfaceLight, borderColor: colors.glassBorder }]}>
                    <Text style={[styles.artistAvatarText, { color: colors.accentSecondary }]}>
                        {item.name[0]?.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.artistInfo}>
                    <Text style={[styles.artistNameText, { color: colors.white }]}>{item.name}</Text>
                    <Text style={[styles.artistGenresText, { color: colors.gray[400] }]}>
                        {item.genres.join(' · ')}
                    </Text>
                    <Text style={[styles.artistMeta, { color: colors.gray[500] }]}>
                        {item.trackIds.length} {t.trackCount}
                    </Text>
                </View>
                <Text style={[styles.artistArrow, { color: colors.gray[500] }]}>›</Text>
            </TouchableOpacity>
        </StaggeredEntry>
    );

    return (
        <View style={styles.container}>
            {/* Create button */}
            <TouchableOpacity
                style={[styles.createBtn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
                onPress={() => setShowCreateModal(true)}
                activeOpacity={0.8}
            >
                <View style={[styles.createBtnIcon, { backgroundColor: colors.glassActive }]}>
                    <Text style={[styles.createBtnPlus, { color: colors.accentSecondary }]}>+</Text>
                </View>
                <Text style={[styles.createBtnText, { color: colors.white }]}>{t.createArtist}</Text>
            </TouchableOpacity>

            {artists.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.gray[600] }]}>{t.noArtists}</Text>
            )}

            <FlatList
                data={artists}
                renderItem={renderArtist}
                keyExtractor={item => item.id}
                scrollEnabled={false}
            />

            {/* Create modal */}
            <Modal visible={showCreateModal} transparent animationType="fade" onRequestClose={() => setShowCreateModal(false)}>
                <View style={styles.modalOverlay}>
                    <Animated.View entering={SlideInUp.springify().damping(16)}>
                        <GlassCard style={styles.modalCard} variant="accent" glow>
                            <Text style={styles.modalTitle}>{t.createArtist}</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder={t.artistName}
                                placeholderTextColor={THEME.colors.gray[600]}
                                value={newName}
                                onChangeText={setNewName}
                                autoFocus
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder={t.artistGenres + ' (Afro-Punk, Neo-Soul...)'}
                                placeholderTextColor={THEME.colors.gray[600]}
                                value={newGenres}
                                onChangeText={setNewGenres}
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.modalBtn}
                                    onPress={() => { setShowCreateModal(false); setNewName(''); setNewGenres(''); }}
                                >
                                    <Text style={styles.modalBtnText}>{t.cancel}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.modalBtnPrimary]}
                                    onPress={handleCreate}
                                    disabled={creating || !newName.trim()}
                                >
                                    <Text style={[styles.modalBtnText, { color: THEME.colors.white }]}>
                                        {creating ? '...' : t.createArtist}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: THEME.spacing.sm },

    createBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: THEME.spacing.md, marginBottom: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg, borderWidth: 1,
    },
    createBtnIcon: {
        width: 28, height: 28, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.sm,
    },
    createBtnPlus: { fontSize: 18, fontWeight: '700' },
    createBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },

    emptyText: { textAlign: 'center', paddingVertical: THEME.spacing.xl, fontSize: 12 },

    artistItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    },
    artistAvatar: {
        width: 44, height: 44, borderRadius: 22,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.md, borderWidth: 1,
    },
    artistAvatarText: { fontSize: 18, fontWeight: '800' },
    artistInfo: { flex: 1 },
    artistNameText: { fontWeight: '700', fontSize: 15 },
    artistGenresText: { fontSize: 11, marginTop: 2 },
    artistMeta: { fontSize: 10, marginTop: 2 },
    artistArrow: { fontSize: 22, fontWeight: '300' },

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
        borderWidth: 1, borderColor: THEME.colors.glassBorder, marginBottom: THEME.spacing.md,
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: THEME.spacing.sm },
    modalBtn: { paddingVertical: 10, paddingHorizontal: 20, marginLeft: THEME.spacing.md },
    modalBtnPrimary: {
        backgroundColor: THEME.colors.accent, borderRadius: THEME.borderRadius.md,
    },
    modalBtnText: { color: THEME.colors.gray[400], fontWeight: '800', fontSize: 12, letterSpacing: 2 },
});
