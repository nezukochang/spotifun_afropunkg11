import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { THEME } from '../theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: THEME.colors.glass,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: THEME.colors.glassBorder,
        overflow: 'hidden',
        // Note: Real blur requires react-native-blur or Expo BlurView.
        // We simulate with low opacity and border glow.
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    content: {
        padding: THEME.spacing.md,
    },
});
