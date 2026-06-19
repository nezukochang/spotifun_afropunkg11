import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { THEME } from '../theme';
import { AfricanSlideshow } from './AfricanSlideshow';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface AfroPunkBackgroundProps {
    children?: React.ReactNode;
    showSlideshow?: boolean;
}

// ─── Floating particle ──────────────────────────────────────
const Particle = ({ index }: { index: number }) => {
    const x = useSharedValue(Math.random() * SCREEN_W);
    const y = useSharedValue(Math.random() * SCREEN_H);
    const opacity = useSharedValue(0);

    useEffect(() => {
        const delay = index * 700;
        opacity.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(0.5, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, false
        ));
        y.value = withRepeat(
            withTiming(y.value - 60 - Math.random() * 100, {
                duration: 6000 + Math.random() * 4000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1, true
        );
    }, [index, opacity, y]);

    const style = useAnimatedStyle(() => ({
        position: 'absolute' as const,
        left: x.value,
        top: y.value,
        width: 2 + (index % 3) * 2,
        height: 2 + (index % 3) * 2,
        borderRadius: 3,
        backgroundColor: index % 3 === 0
            ? THEME.colors.accentGold
            : index % 3 === 1
                ? THEME.colors.accent
                : THEME.colors.accentViolet,
        opacity: opacity.value,
    }));

    return <Animated.View style={style} />;
};

// ─── Kente cloth horizontal band ────────────────────────────
const KenteBand = ({ top, opacity = 0.04 }: { top: number; opacity?: number }) => {
    const shift = useSharedValue(0);

    useEffect(() => {
        shift.value = withRepeat(
            withTiming(40, { duration: 20000 + Math.random() * 10000, easing: Easing.linear }),
            -1, true
        );
    }, [shift]);

    const style = useAnimatedStyle(() => ({
        position: 'absolute' as const,
        top,
        left: shift.value - 40,
        right: shift.value - 40,
        height: 60,
        opacity,
        flexDirection: 'row' as const,
    }));

    const stripes = useMemo(() => [
        'rgba(255,184,0,0.25)', 'rgba(255,87,51,0.2)', 'rgba(139,92,246,0.2)',
        'rgba(255,184,0,0.3)', 'rgba(255,87,51,0.15)', 'rgba(139,92,246,0.15)',
        'rgba(255,184,0,0.2)', 'rgba(255,87,51,0.25)', 'rgba(139,92,246,0.2)',
    ], []);

    return (
        <Animated.View style={style} pointerEvents="none">
            {stripes.map((c, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: c }} />
            ))}
        </Animated.View>
    );
};

// ─── Adinkra symbol (small decorative dots pattern) ────────
const AdinkraPattern = ({ top, left, size = 80 }: { top: number; left: number; size?: number }) => {
    const opacity = useSharedValue(0.03);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.07, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.03, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, false
        );
    }, [opacity]);

    const style = useAnimatedStyle(() => ({
        position: 'absolute' as const,
        top,
        left,
        width: size,
        height: size,
        opacity: opacity.value,
    }));

    const dots = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if ((row + col) % 2 === 0) {
                dots.push(
                    <View
                        key={`${row}-${col}`}
                        style={{
                            position: 'absolute',
                            width: size / 8,
                            height: size / 8,
                            borderRadius: size / 16,
                            backgroundColor: THEME.colors.accentGold,
                            left: col * (size / 4) + size / 8 - size / 16,
                            top: row * (size / 4) + size / 8 - size / 16,
                        }}
                    />
                );
            }
        }
    }

    return <Animated.View style={style}>{dots}</Animated.View>;
};

// ─── Pulsing edge glow (softer, wider) ──────────────────────
const EdgeGlow = ({ side, intensity = 0.2 }: { side: 'top' | 'bottom' | 'left' | 'right'; intensity?: number }) => {
    const opacity = useSharedValue(0.1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(intensity, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.08, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, false
        );
    }, [intensity, opacity]);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const isHorizontal = side === 'top' || side === 'bottom';
    const positionStyle: any = { [side]: 0 };

    return (
        <Animated.View
            style={[
                styles.edgeGlow,
                positionStyle,
                isHorizontal ? styles.edgeH : styles.edgeV,
                style,
            ]}
        />
    );
};

// ─── Main Component ─────────────────────────────────────────
export const AfroPunkBackground: React.FC<AfroPunkBackgroundProps> = ({ children, showSlideshow = false }) => {
    return (
        <View style={styles.container}>
            {showSlideshow && <AfricanSlideshow visible={showSlideshow} />}

            {/* Softer gradient layers */}
            <View style={[styles.gradientLayer1, { backgroundColor: 'rgba(20,18,14,0.92)' }]} />
            <View style={[styles.gradientLayer2, { backgroundColor: 'rgba(139,92,246,0.02)' }]} />

            {/* Kente bands for African textile reference */}
            <KenteBand top={SCREEN_H * 0.15} opacity={0.03} />
            <KenteBand top={SCREEN_H * 0.55} opacity={0.025} />
            <KenteBand top={SCREEN_H * 0.85} opacity={0.02} />

            {/* Adinkra patterns */}
            <AdinkraPattern top={SCREEN_H * 0.22} left={SCREEN_W * 0.05} size={70} />
            <AdinkraPattern top={SCREEN_H * 0.45} left={SCREEN_W * 0.75} size={90} />
            <AdinkraPattern top={SCREEN_H * 0.7} left={SCREEN_W * 0.15} size={60} />

            {/* Floating particles */}
            {Array.from({ length: 10 }).map((_, i) => (
                <Particle key={i} index={i} />
            ))}

            {/* Softer edge glows */}
            <EdgeGlow side="top" intensity={0.15} />
            <EdgeGlow side="bottom" intensity={0.12} />
            <EdgeGlow side="left" intensity={0.1} />
            <EdgeGlow side="right" intensity={0.1} />

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.void,
    },
    gradientLayer1: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientLayer2: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
    },
    edgeGlow: {
        position: 'absolute',
    },
    edgeH: {
        left: 0,
        right: 0,
        height: 160,
    },
    edgeV: {
        top: 0,
        bottom: 0,
        width: 120,
    },
});
