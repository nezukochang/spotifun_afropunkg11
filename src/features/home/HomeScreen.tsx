import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { getCatalog, AfroTrack } from '../../services/catalog/catalogService';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const HomeScreen = () => {
    const [tracks, setTracks] = useState<AfroTrack[]>([]);
    const playTrack = usePlayerStore(state => state.playTrack);

    useEffect(() => {
        getCatalog().then(setTracks);
    }, []);

    const genres = Array.from(new Set(tracks.map(t => t.genre)));

    const renderTrackItem = ({ item }: { item: AfroTrack }) => (
        <TouchableOpacity onPress={() => playTrack(item)}>
            <GlassCard style={styles.trackCard}>
                <Image source={{ uri: item.artwork as string }} style={styles.artwork} />
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackArtist}>{item.artist}</Text>
            </GlassCard>
        </TouchableOpacity>
    );

    return (
        <AfroPunkBackground>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.greeting}>SPOTIFUN</Text>
                    </View>
                </View>

                {genres.map(genre => (
                    <View key={genre} style={styles.genreSection}>
                        <Text style={styles.genreTitle}>{genre.toUpperCase()}</Text>
                        <FlatList
                            data={tracks.filter(t => t.genre === genre)}
                            renderItem={renderTrackItem}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.listPadding}
                        />
                    </View>
                ))}
            </ScrollView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: THEME.spacing.xl, marginTop: THEME.spacing.lg },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: THEME.typography.sizes.lg,
        fontWeight: '900',
        color: THEME.colors.white,
        letterSpacing: 2,
    },
    genreSection: { marginBottom: THEME.spacing.xl },
    genreTitle: {
        paddingHorizontal: THEME.spacing.xl,
        fontSize: 12,
        fontWeight: '900',
        color: THEME.colors.gray[400],
        letterSpacing: 2,
        marginBottom: THEME.spacing.md,
    },
    trackCard: { width: 160, marginRight: THEME.spacing.md, padding: THEME.spacing.sm },
    artwork: { width: '100%', aspectRatio: 1, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm },
    trackTitle: { color: THEME.colors.white, fontWeight: '700', fontSize: 13 },
    trackArtist: { color: THEME.colors.gray[400], fontSize: 11, marginTop: 2 },
    listPadding: { paddingHorizontal: THEME.spacing.xl },
});
