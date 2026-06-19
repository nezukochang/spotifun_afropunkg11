import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { THEME } from '../theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'accent' | 'gold';
    glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, variant = 'default', glow = false }) => {
    const borderColor =
        variant === 'accent' ? 'rgba(255, 87, 51, 0.2)'
        : variant === 'gold' ? 'rgba(255, 184, 0, 0.2)'
        : THEME.colors.glassBorder;

    const shadowStyle = glow
        ? variant === 'gold' ? THEME.shadows.goldGlow : THEME.shadows.glow
        : THEME.shadows.card;

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            style={[
                styles.card,
                { borderColor },
                glow
                    ? Platform.select({ ios: shadowStyle as any, android: { elevation: 6 } })
                    : Platform.select({ ios: shadowStyle as any, android: { elevation: 2 } }),
                style,
            ]}
        >
            {/* Gradient accent strip at top */}
            <View style={[styles.accentStrip, {
                backgroundColor: variant === 'accent' ? THEME.colors.accent
                    : variant === 'gold' ? THEME.colors.accentGold
                    : 'rgba(255, 255, 255, 0.06)',
            }]} />
            <View style={styles.content}>
                {children}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.colors.glass,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    accentStrip: {
        height: 2,
        width: '100%',
        opacity: 0.6,
    },
    content: {
        padding: THEME.spacing.md,
    },
});
