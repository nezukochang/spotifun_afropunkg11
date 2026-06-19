import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useProgress } from 'react-native-track-player';
import Animated, {
    FadeInUp, SlideInUp,
    useSharedValue, useAnimatedStyle,
    withRepeat, withTiming, withSpring, withSequence,
    Easing, interpolate,
} from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { SocialPanel } from '../../shared/ui/SocialPanel';
import { HandoffPanel } from '../bluetooth/HandoffPanel';
import { QueueModal } from './QueueModal';

const { width: SCREEN_W } = Dimensions.get('window');
const ART_SIZE = Math.min(SCREEN_W - 80, 320);

function formatTime(sec: number): string {
    if (!sec || isNaN(sec)) { return '0:00'; }
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Error boundary for SocialPanel
class SocialErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) { return null; }
        return this.props.children;
    }
}

export const PlayerScreen = () => {
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const {
        currentTrack, isPlaying, togglePlay,
        skipNext, skipPrevious, seekTo,
        shuffleMode, toggleShuffle,
        repeatMode, cycleRepeat,
        queue, trackPlayerReady,
    } = usePlayerStore();

    const updateProgress = usePlayerStore(s => s.updateProgress);
    // Only poll progress when TrackPlayer is ready
    const progress = useProgress(trackPlayerReady ? 250 : 999999);

    useEffect(() => {
        if (trackPlayerReady) {
            updateProgress(progress.position, progress.duration);
        }
    }, [progress.position, progress.duration, updateProgress, trackPlayerReady]);

    const [isHandoffVisible, setIsHandoffVisible] = useState(false);
    const [isQueueVisible, setIsQueueVisible] = useState(false);
    const [progressBarWidth, setProgressBarWidth] = useState(SCREEN_W - 80);

    // Vinyl rotation
    const rotation = useSharedValue(0);
    useEffect(() => {
        if (isPlaying) {
            rotation.value = withRepeat(
                withTiming(rotation.value + 360, { duration: 8000, easing: Easing.linear }),
                -1, false,
            );
        }
    }, [isPlaying]);

    const vinylStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    // Play button pulse
    const playPulse = useSharedValue(0);
    useEffect(() => {
        if (isPlaying) {
            playPulse.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                ),
                -1, false,
            );
        } else {
            playPulse.value = withTiming(0, { duration: 300 });
        }
    }, [isPlaying]);

    const playGlowStyle = useAnimatedStyle(() => ({
        shadowOpacity: interpolate(playPulse.value, [0, 1], [0.3, 0.8]),
        shadowRadius: interpolate(playPulse.value, [0, 1], [8, 20]),
    }));

    const prevScale = useSharedValue(1);
    const nextScale = useSharedValue(1);
    const playScale = useSharedValue(1);

    const positionSec = progress.position || 0;
    const durationSec = progress.duration || 0;
    const progressPercent = durationSec > 0 ? (positionSec / durationSec) * 100 : 0;
    const artworkUri = currentTrack?.artwork as string | undefined;

    const handleSeek = useCallback((event: any) => {
        if (!durationSec) { return; }
        const { locationX } = event.nativeEvent;
        const ratio = Math.min(1, Math.max(0, locationX / progressBarWidth));
        seekTo(ratio * durationSec);
    }, [durationSec, progressBarWidth, seekTo]);

    const repeatColor = repeatMode === 'off' ? THEME.colors.gray[500] : THEME.colors.accentGold;

    return (
        <AfroPunkBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Animated.View entering={FadeInUp.delay(50)} style={styles.header}>
                        <Text style={[styles.headerLabel, { color: colors.gray[400] }]}>{t.nowPlaying}</Text>
                        <TouchableOpacity onPress={() => setIsQueueVisible(true)}>
                            <Text style={[styles.queueBtn, { color: colors.gray[400] }]}>☰ {queue.length}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Artwork with vinyl effect (no SpringBounce to avoid conflicts) */}
                    <View style={styles.artworkContainer}>
                        <Animated.View entering={FadeInUp.delay(100).springify()} style={[styles.artworkWrapper, vinylStyle]}>
                            {artworkUri ? (
                                <Image source={{ uri: artworkUri }} style={styles.artwork} />
                            ) : (
                                <Image
                                    source={require('../../assets/images/afropunk_album_art.jpg')}
                                    style={styles.artwork}
                                />
                            )}
                            <View style={styles.vinylRing} />
                            <View style={styles.vinylCenter} />
                        </Animated.View>
                    </View>

                    {/* Track info */}
                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.metaContainer}>
                        <GlassCard style={styles.glassCard} variant="accent" glow>
                            <Text style={[styles.trackTitle, { color: colors.white }]}>{currentTrack?.title || t.spotifunTrack}</Text>
                            <Text style={[styles.artistName, { color: colors.gray[300] }]}>{currentTrack?.artist || t.unknownArtist}</Text>

                            {/* Progress bar */}
                            <View style={styles.progressContainer}>
                                <TouchableOpacity
                                    style={styles.progressBar}
                                    activeOpacity={0.9}
                                    onPress={handleSeek}
                                    onLayout={(event) => setProgressBarWidth(event.nativeEvent.layout.width || SCREEN_W - 80)}
                                >
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                                    </View>
                                    <View style={[styles.progressThumb, { left: `${progressPercent}%` }]} />
                                    <View style={[styles.progressGlow, { left: `${progressPercent}%` }]} />
                                </TouchableOpacity>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}>{formatTime(positionSec)}</Text>
                                    <Text style={styles.timeText}>{formatTime(durationSec)}</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </Animated.View>

                    {/* Controls */}
                    <Animated.View entering={SlideInUp.delay(400).springify().damping(16)} style={styles.controls}>
                        <GlassCard style={styles.controlsCard}>
                            <View style={styles.mainControls}>
                                <TouchableOpacity onPress={toggleShuffle} style={styles.controlBtn}>
                                    <Text style={[styles.controlIcon, shuffleMode && styles.activeControl]}>⇄</Text>
                                    {shuffleMode && <View style={styles.activeIndicator} />}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { prevScale.value = withSpring(0.8, { damping: 10 }, () => { prevScale.value = withSpring(1); }); skipPrevious(); }}
                                    style={styles.controlBtn}
                                >
                                    <Animated.Text style={[styles.controlIcon, { transform: [{ scale: prevScale }] }]}>⏮</Animated.Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    playScale.value = withSpring(0.85, { damping: 10 }, () => { playScale.value = withSpring(1); });
                                    togglePlay();
                                }}>
                                    <Animated.View style={[styles.playPauseBtn, playGlowStyle, { transform: [{ scale: playScale }] }]}>
                                        <Text style={styles.playPauseIcon}>
                                            {isPlaying ? '❚❚' : '▶'}
                                        </Text>
                                    </Animated.View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { nextScale.value = withSpring(0.8, { damping: 10 }, () => { nextScale.value = withSpring(1); }); skipNext(); }}
                                    style={styles.controlBtn}
                                >
                                    <Animated.Text style={[styles.controlIcon, { transform: [{ scale: nextScale }] }]}>⏭</Animated.Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={cycleRepeat} style={styles.controlBtn}>
                                    <Text style={[styles.controlIcon, { color: repeatColor }]}>
                                        {repeatMode === 'one' ? '↺₁' : '↺'}
                                    </Text>
                                    {repeatMode !== 'off' && <View style={[styles.activeIndicator, { backgroundColor: repeatColor }]} />}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.secondaryActions}>
                                <TouchableOpacity onPress={() => setIsHandoffVisible(true)} style={styles.secondaryBtn}>
                                    <Text style={styles.secondaryIcon}>📡</Text>
                                    <Text style={[styles.secondaryLabel, { color: colors.gray[400] }]}>{t.handoff}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsQueueVisible(true)} style={styles.secondaryBtn}>
                                    <Text style={styles.secondaryIcon}>☰</Text>
                                    <Text style={[styles.secondaryLabel, { color: colors.gray[400] }]}>{t.queue.toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </Animated.View>

                    {/* Modals */}
                    <Modal visible={isHandoffVisible} transparent animationType="slide" onRequestClose={() => setIsHandoffVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <HandoffPanel
                                trackId={currentTrack?.id || ''}
                                positionMs={Math.round(positionSec * 1000)}
                                onClose={() => setIsHandoffVisible(false)}
                            />
                        </View>
                    </Modal>
                    <QueueModal visible={isQueueVisible} onClose={() => setIsQueueVisible(false)} />

                    {/* Social panel with error boundary */}
                    {currentTrack && (
                        <SocialErrorBoundary>
                            <Animated.View entering={SlideInUp.delay(600).springify()}>
                                <SocialPanel
                                    trackId={currentTrack.id as string}
                                    views={(currentTrack as any).views || 1024}
                                    likes={(currentTrack as any).likes || 42}
                                />
                            </Animated.View>
                        </SocialErrorBoundary>
                    )}
                </ScrollView>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: THEME.spacing.xxl },
    header: {
        padding: THEME.spacing.lg, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
    },
    headerLabel: {
        fontSize: THEME.typography.sizes.xs, fontWeight: '800',
        color: THEME.colors.gray[400], letterSpacing: 3,
    },
    queueBtn: { color: THEME.colors.gray[400], fontSize: 13, fontWeight: '700' },
    artworkContainer: {
        paddingVertical: THEME.spacing.xl,
        justifyContent: 'center', alignItems: 'center',
    },
    artworkWrapper: {
        width: ART_SIZE, height: ART_SIZE,
        borderRadius: THEME.borderRadius.xl,
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden', backgroundColor: THEME.colors.surface,
    },
    artwork: { width: '100%', height: '100%' },
    vinylRing: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 2, borderColor: 'rgba(255, 184, 0, 0.15)',
        borderRadius: THEME.borderRadius.xl,
    },
    vinylCenter: {
        position: 'absolute', top: '50%', left: '50%',
        width: 20, height: 20, marginLeft: -10, marginTop: -10,
        borderRadius: 10, backgroundColor: THEME.colors.accentGold, opacity: 0.3,
    },
    metaContainer: { paddingHorizontal: THEME.spacing.xl },
    glassCard: { padding: THEME.spacing.lg },
    trackTitle: {
        fontSize: THEME.typography.sizes.lg, fontWeight: '800',
        color: THEME.colors.white, textAlign: 'center',
    },
    artistName: {
        fontSize: THEME.typography.sizes.md, color: THEME.colors.gray[300],
        textAlign: 'center', marginTop: THEME.spacing.xs,
    },
    progressContainer: { marginTop: THEME.spacing.xl },
    progressBar: { height: 28, justifyContent: 'center', position: 'relative' },
    progressTrack: {
        height: 4, backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 2, overflow: 'hidden',
    },
    progressFill: {
        height: '100%', backgroundColor: THEME.colors.accentGold,
        borderRadius: 2,
    },
    progressThumb: {
        position: 'absolute', top: '50%', marginTop: -8,
        width: 16, height: 16, borderRadius: 8,
        backgroundColor: THEME.colors.accentGold, marginLeft: -8,
    },
    progressGlow: {
        position: 'absolute', top: '50%', marginTop: -12,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: THEME.colors.accentGold, opacity: 0.15, marginLeft: -12,
    },
    timeContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginTop: THEME.spacing.sm,
    },
    timeText: { fontSize: THEME.typography.sizes.xs, color: THEME.colors.gray[400] },
    controls: { padding: THEME.spacing.xl },
    controlsCard: { padding: THEME.spacing.lg },
    mainControls: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    },
    controlBtn: {
        alignItems: 'center', justifyContent: 'center',
        width: 48, height: 48, position: 'relative',
    },
    controlIcon: { color: THEME.colors.white, fontSize: 20 },
    activeControl: { color: THEME.colors.accentGold },
    activeIndicator: {
        position: 'absolute', bottom: 4,
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: THEME.colors.accentGold,
    },
    playPauseBtn: {
        width: 68, height: 68, borderRadius: 34,
        backgroundColor: THEME.colors.accent,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: THEME.colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12, elevation: 8,
    },
    playPauseIcon: { color: THEME.colors.white, fontSize: 22, fontWeight: '900' },
    secondaryActions: {
        flexDirection: 'row', justifyContent: 'space-around',
        marginTop: THEME.spacing.lg, paddingTop: THEME.spacing.lg,
        borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.04)',
    },
    secondaryBtn: { alignItems: 'center' },
    secondaryIcon: { fontSize: 18 },
    secondaryLabel: {
        color: THEME.colors.gray[400], fontSize: 9,
        fontWeight: '800', letterSpacing: 2, marginTop: 4,
    },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center', padding: THEME.spacing.xl,
    },
});
