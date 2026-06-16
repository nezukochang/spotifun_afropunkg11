import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Pressable, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { THEME } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'accent' | 'punk' | 'outline';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const Button = ({ title, onPress, variant = 'accent', style, textStyle }: ButtonProps) => {
    const scale = useSharedValue(1);

    const backgroundColor = variant === 'accent' ? THEME.colors.accent : variant === 'punk' ? THEME.colors.gray[800] : 'transparent';
    const borderColor = variant === 'outline' ? THEME.colors.accent : 'transparent';
    const borderWidth = variant === 'outline' ? 1 : 0;
    const textColor = variant === 'outline' ? THEME.colors.accent : THEME.colors.white;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.95);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
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
                    { backgroundColor, borderColor, borderWidth },
                    animatedStyle,
                    style,
                ]}
            >
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title.toUpperCase()}</Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    text: {
        fontSize: THEME.typography.sizes.md,
        fontWeight: THEME.typography.weights.black as any,
        letterSpacing: 2,
    },
});
