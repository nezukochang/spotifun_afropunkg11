import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {
    SlideInDown, SlideOutDown,
    useSharedValue, useAnimatedStyle,
    withRepeat, withTiming, withSequence,
    withSpring, Easing, interpolate,
} from 'react-native-reanimated';
import { useProgress } from 'react-native-track-player';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../i18n/useI18nStore';
import { THEME } from '../theme';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const MiniPlayer: React.FC = React.memo(() => {
    const { currentTrack, isPlaying, togglePlay, trackPlayerReady } = usePlayerStore();
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const progress = useProgress(trackPlayerReady ? 500 : 999999);

    // Pulsing glow on play button
    const pulseVal = useSharedValue(0);
    useEffect(() => {
        if (isPlaying) {
            pulseVal.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                ),
                -1, false,
            );
        } else {
            pulseVal.value = withTiming(0, { duration: 300 });
        }
    }, [isPlaying]);

    // Spring scale on play button press
    const playScale = useSharedValue(1);

    const pulseStyle = useAnimatedStyle(() => ({
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: interpolate(pulseVal.value, [0, 1], [0.2, 0.7]),
        shadowRadius: interpolate(pulseVal.value, [0, 1], [4, 14]),
        elevation: interpolate(pulseVal.value, [0, 1], [2, 8]),
    }));

    const playAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: playScale.value }],
    }));

    const handlePress = useCallback(() => {
        try {
            if (navigationRef.isReady()) {
                navigationRef.navigate('MainTabs' as never, { screen: 'Player' } as never);
            }
        } catch (e) {
            console.warn('[MiniPlayer] Navigation error:', e);
        }
    }, []);

    if (!currentTrack) { return null; }

    const artworkUri = currentTrack.artwork as string | undefined;
    const progressPct = progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0;

    return (
        <Animated.View
            entering={SlideInDown.springify().damping(18).stiffness(150)}
            exiting={SlideOutDown.duration(200)}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={[styles.inner, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>

                {/* Accent strip at top */}
                <View style={[styles.accentStrip, { backgroundColor: colors.accent }]} />

                <View style={styles.row}>
                    {/* Artwork */}
                    <View style={styles.artworkWrap}>
                        {artworkUri ? (
                            <Image source={{ uri: artworkUri }} style={styles.artwork} />
                        ) : (
                            <View style={[styles.artwork, styles.artworkFallback, { backgroundColor: colors.surfaceLight }]}>
                                <Text style={[styles.fallbackIcon, { color: colors.accentSecondary }]}>♫</Text>
                            </View>
                        )}
                    </View>

                    {/* Track info */}
                    <View style={styles.info}>
                        <Text style={[styles.title, { color: colors.white }]} numberOfLines={1}>
                            {currentTrack.title || t.spotifunTrack}
                        </Text>
                        <Text style={[styles.artist, { color: colors.gray[400] }]} numberOfLines={1}>
                            {currentTrack.artist || t.unknownArtist}
                        </Text>
                    </View>

                    {/* Play/Pause */}
                    <Animated.View style={pulseStyle}>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                playScale.value = withSequence(
                                    withSpring(0.85, { damping: 12 }),
                                    withSpring(1),
                                );
                                togglePlay();
                            }}
                            style={styles.playBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Animated.View style={[styles.playBtnInner, { backgroundColor: colors.accent }, playAnimStyle]}>
                                <Text style={styles.playIcon}>
                                    {isPlaying ? '❚❚' : '▶'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: colors.accentSecondary }]} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 70,
        left: 8,
        right: 8,
        zIndex: 100,
    },
    inner: {
        backgroundColor: 'rgba(18, 18, 26, 0.97)',
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
    },
    accentStrip: {
        height: 2,
        backgroundColor: THEME.colors.accent,
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.sm,
        paddingVertical: 8,
    },
    artworkWrap: {
        width: 42,
        height: 42,
        borderRadius: THEME.borderRadius.md,
        overflow: 'hidden',
        marginRight: THEME.spacing.sm,
    },
    artwork: { width: 42, height: 42 },
    artworkFallback: {
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackIcon: { color: THEME.colors.accentGold, fontSize: 16 },
    info: { flex: 1, marginRight: THEME.spacing.sm },
    title: { color: THEME.colors.white, fontWeight: '700', fontSize: 13 },
    artist: { color: THEME.colors.gray[400], fontSize: 11, marginTop: 1 },
    playBtn: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtnInner: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: THEME.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: { color: THEME.colors.white, fontSize: 13, fontWeight: '900' },
    // Progress
    progressTrack: {
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    progressFill: {
        height: '100%',
        backgroundColor: THEME.colors.accentGold,
        borderRadius: 1,
    },
});
