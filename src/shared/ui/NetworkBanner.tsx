import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useI18nStore } from '../i18n/useI18nStore';
import { THEME } from '../theme';

export const NetworkBanner: React.FC = () => {
    const { isConnected } = useNetworkStatus();
    const { t } = useI18nStore();

    if (isConnected) { return null; }

    return (
        <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(200)}
            style={styles.banner}
        >
            <Text style={styles.text}>{t.networkError}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: THEME.colors.error,
        paddingVertical: 6,
        alignItems: 'center',
        zIndex: 1000,
    },
    text: {
        color: THEME.colors.white,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
