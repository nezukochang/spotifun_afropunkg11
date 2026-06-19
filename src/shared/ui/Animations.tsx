import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
    FadeInUp,
    FadeInDown,
    SlideInRight,
    Layout,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    Easing,
    interpolate,
} from 'react-native-reanimated';

// ─── Staggered list entry ───────────────────────────────────
export const StaggeredEntry = ({ index, children }: { index: number; children: React.ReactNode }) => {
    return (
        <Animated.View
            entering={FadeInUp.delay(index * 60).duration(500).springify().damping(18)}
            layout={Layout.springify().damping(20)}
        >
            {children}
        </Animated.View>
    );
};

// ─── Slide-in with scale ────────────────────────────────────
export const SlideInScale = ({ index = 0, children }: { index?: number; children: React.ReactNode }) => {
    return (
        <Animated.View
            entering={SlideInRight.delay(index * 80).duration(450).springify().damping(15)}
            layout={Layout.springify()}
        >
            {children}
        </Animated.View>
    );
};

// ─── Float up animation ─────────────────────────────────────
export const FloatUp = ({ delay = 0, children }: { delay?: number; children: React.ReactNode }) => {
    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(600).springify().damping(14).stiffness(120)}
        >
            {children}
        </Animated.View>
    );
};

// ─── Pulsing glow wrapper ───────────────────────────────────
export const PulseGlow = ({
    children,
    color = 'rgba(255, 87, 51, 0.4)',
    duration = 2000,
}: {
    children: React.ReactNode;
    color?: string;
    duration?: number;
}) => {
    const glow = useSharedValue(0);

    useEffect(() => {
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, false
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: interpolate(glow.value, [0, 1], [0.1, 0.6]),
        shadowRadius: interpolate(glow.value, [0, 1], [4, 16]),
        elevation: interpolate(glow.value, [0, 1], [2, 8]),
    }));

    return (
        <Animated.View style={style}>
            {children}
        </Animated.View>
    );
};

// ─── Spring bounce on appear ────────────────────────────────
export const SpringBounce = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const scale = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 180, mass: 0.8 });
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: interpolate(scale.value, [0.5, 1], [0, 1]),
    }));

    return (
        <Animated.View style={[{ opacity: 0 }, style]}>
            {children}
        </Animated.View>
    );
};

export const StandardTitle = ({ text, style }: { text: string; style?: any }) => {
    return (
        <Text style={style}>{text}</Text>
    );
};
