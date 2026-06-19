import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { THEME } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'accent' | 'punk' | 'outline' | 'gold';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ title, onPress, variant = 'accent', style, textStyle, size = 'md' }: ButtonProps) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    const backgroundColor =
        variant === 'accent' ? THEME.colors.accent
        : variant === 'gold' ? THEME.colors.accentGold
        : variant === 'punk' ? THEME.colors.surfaceLight
        : 'transparent';

    const borderColor = variant === 'outline' ? THEME.colors.accentGold : 'transparent';
    const borderWidth = variant === 'outline' ? 1.5 : 0;
    const textColor =
        variant === 'outline' ? THEME.colors.accentGold
        : variant === 'gold' ? THEME.colors.void
        : THEME.colors.white;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowOpacity: glow.value,
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.92, { damping: 12, stiffness: 300 });
        glow.value = withTiming(0.5, { duration: 200 });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        glow.value = withTiming(0.2, { duration: 300 });
    };

    const sizeStyles = {
        sm: { paddingVertical: THEME.spacing.sm, paddingHorizontal: THEME.spacing.md, height: 36 },
        md: { paddingVertical: THEME.spacing.md, paddingHorizontal: THEME.spacing.lg, height: 48 },
        lg: { paddingVertical: THEME.spacing.lg, paddingHorizontal: THEME.spacing.xl, height: 56 },
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View
                style={[
                    styles.button,
                    sizeStyles[size],
                    { backgroundColor, borderColor, borderWidth },
                    animatedStyle,
                    style,
                ]}
            >
                <Text style={[styles.text, { color: textColor }, textStyle]}>
                    {title.toUpperCase()}
                </Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: THEME.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: THEME.colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },
    text: {
        fontSize: THEME.typography.sizes.sm,
        fontWeight: THEME.typography.weights.black as any,
        letterSpacing: 3,
    },
});
