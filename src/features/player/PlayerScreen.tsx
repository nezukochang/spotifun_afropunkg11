import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Platform, Modal } from 'react-native';
import { THEME } from '../../shared/theme';
import { Button } from '../../shared/ui/Button';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { SocialPanel } from '../../shared/ui/SocialPanel';
import { HandoffPanel } from '../bluetooth/HandoffPanel';

export const PlayerScreen = () => {
    const { currentTrack, isPlaying, togglePlay } = usePlayerStore();
    const [isHandoffVisible, setIsHandoffVisible] = useState(false);

    return (
        <AfroPunkBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>NOW PLAYING</Text>
                    </View>

                    <View style={styles.artworkContainer}>
                        <View style={styles.artworkWrapper}>
                            <Image
                                source={require('../../assets/images/afropunk_album_art.jpg')}
                                style={styles.artwork as any}
                            />
                        </View>
                    </View>

                    <View style={styles.metaContainer}>
                        <GlassCard style={styles.glassCard}>
                            <Text style={styles.trackTitle}>{currentTrack?.title || 'SPOTIFUN TRACK'}</Text>
                            <Text style={styles.artistName}>{currentTrack?.artist || 'Unknown Artist'}</Text>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: '45%' }]} />
                                </View>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}>1:42</Text>
                                    <Text style={styles.timeText}>3:25</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </View>

                    <View style={styles.controls}>
                        <GlassCard style={styles.controlsCard}>
                            <View style={styles.mainControls}>
                                <Button
                                    title={isPlaying ? 'PAUSE' : 'PLAY'}
                                    onPress={togglePlay}
                                    variant="accent"
                                    style={styles.syncButton}
                                />
                            </View>
                            <Button
                                title="BLUETOOTH HANDOFF"
                                onPress={() => setIsHandoffVisible(true)}
                                variant="outline"
                                style={{ marginTop: THEME.spacing.md }}
                                textStyle={styles.handoffText}
                            />
                        </GlassCard>
                    </View>

                    <Modal
                        visible={isHandoffVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setIsHandoffVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <HandoffPanel
                                trackId={currentTrack?.id || ''}
                                positionMs={102000}
                                onClose={() => setIsHandoffVisible(false)}
                            />
                        </View>
                    </Modal>

                    {currentTrack && (
                        <SocialPanel
                            trackId={currentTrack.id}
                            views={(currentTrack as any).views || 1024}
                            likes={(currentTrack as any).likes || 42}
                        />
                    )}
                </ScrollView>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: THEME.spacing.xxl,
    },
    header: {
        padding: THEME.spacing.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: THEME.typography.sizes.sm,
        fontWeight: THEME.typography.weights.bold as any,
        color: THEME.colors.gray[400],
        letterSpacing: 2,
    },
    artworkContainer: {
        paddingVertical: THEME.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    artworkWrapper: {
        width: 280,
        height: 280,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        backgroundColor: THEME.colors.void,
    },
    artwork: {
        width: '100%',
        height: '100%',
    },
    metaContainer: {
        paddingHorizontal: THEME.spacing.xl,
    },
    trackTitle: {
        fontSize: THEME.typography.sizes.lg,
        fontWeight: THEME.typography.weights.bold as any,
        color: THEME.colors.white,
        textAlign: 'center',
    },
    artistName: {
        fontSize: THEME.typography.sizes.md,
        color: THEME.colors.gray[400],
        textAlign: 'center',
        marginTop: THEME.spacing.xs,
    },
    progressContainer: {
        marginTop: THEME.spacing.xl,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: THEME.colors.accent,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: THEME.spacing.sm,
    },
    timeText: {
        fontSize: THEME.typography.sizes.xs,
        color: THEME.colors.gray[400],
    },
    controls: {
        padding: THEME.spacing.xl,
    },
    mainControls: {
        alignItems: 'center',
    },
    syncButton: {
        width: '100%',
        height: 54,
    },
    glassCard: {
        padding: THEME.spacing.lg,
    },
    controlsCard: {
        padding: THEME.spacing.md,
    },
    handoffText: {
        color: THEME.colors.white,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: THEME.spacing.xl,
    },
});

