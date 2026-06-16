import { FriendsList } from '../../shared/ui/FriendsList';
import { StaggeredEntry } from '../../shared/ui/Animations';
import { useAuthStore } from '../../stores/useAuthStore';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { getUserPlaylists } from '../../services/catalog/userLibraryService';

export const LibraryScreen = () => {
    const { user } = useAuthStore();
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [activeSection, setActiveSection] = useState<'playlists' | 'friends'>('playlists');

    useEffect(() => {
        if (user) {
            getUserPlaylists(user.id).then(({ data }) => {
                if (data) { setPlaylists(data); }
            });
        }
    }, [user]);

    return (
        <AfroPunkBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>YOUR COLLECTION</Text>
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => setActiveSection('playlists')} style={[styles.tab, activeSection === 'playlists' && styles.activeTab]}>
                        <Text style={[styles.tabLabel, activeSection === 'playlists' && styles.activeTabLabel]}>PLAYLISTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveSection('friends')} style={[styles.tab, activeSection === 'friends' && styles.activeTab]}>
                        <Text style={[styles.tabLabel, activeSection === 'friends' && styles.activeTabLabel]}>TRIBE</Text>
                    </TouchableOpacity>
                </View>

                {activeSection === 'playlists' ? (
                    <FlatList
                        data={playlists}
                        ListHeaderComponent={() => (
                            <TouchableOpacity style={styles.favoriteCard}>
                                <GlassCard style={styles.favoriteContent}>
                                    <Text style={styles.favoriteText}>LIKED TRACKS</Text>
                                    <Text style={styles.countText}>12 TOTAL</Text>
                                </GlassCard>
                            </TouchableOpacity>
                        )}
                        renderItem={({ item, index }) => (
                            <StaggeredEntry index={index}>
                                <TouchableOpacity style={styles.playlistItem}>
                                    <Text style={styles.playlistName}>{item.name}</Text>
                                </TouchableOpacity>
                            </StaggeredEntry>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listPadding}
                    />
                ) : (
                    <ScrollView contentContainerStyle={styles.listPadding}>
                        <FriendsList />
                    </ScrollView>
                )}
            </View>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: THEME.spacing.xl, marginTop: THEME.spacing.lg },
    title: { fontSize: 24, fontWeight: '700', color: THEME.colors.white, letterSpacing: 2 },
    tabs: { flexDirection: 'row', paddingHorizontal: THEME.spacing.xl, marginBottom: THEME.spacing.lg },
    tab: { marginRight: THEME.spacing.xl, paddingBottom: 8 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: THEME.colors.accent },
    tabLabel: { color: THEME.colors.gray[700], fontWeight: '700', fontSize: 12, letterSpacing: 1 },
    activeTabLabel: { color: THEME.colors.white },
    favoriteCard: { marginBottom: THEME.spacing.xl },
    favoriteContent: { height: 100, justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    favoriteText: { color: THEME.colors.white, fontWeight: '700', fontSize: 18, letterSpacing: 1, textAlign: 'center' },
    countText: { color: THEME.colors.gray[400], textAlign: 'center', marginTop: 4, fontSize: 10 },
    playlistItem: { paddingVertical: THEME.spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
    playlistName: { color: THEME.colors.white, fontWeight: '600', fontSize: 16 },
    listPadding: { paddingHorizontal: THEME.spacing.xl },
});
