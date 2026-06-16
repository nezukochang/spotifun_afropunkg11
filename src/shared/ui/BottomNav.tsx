import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { THEME } from '../theme';

export type TabType = 'home' | 'player' | 'library' | 'settings';

interface BottomNavProps {
    currentTab: TabType;
    onTabPress: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabPress }) => {
    const tabs: { type: TabType; label: string }[] = [
        { type: 'home', label: 'HOME' },
        { type: 'library', label: 'LIBRARY' },
        { type: 'player', label: 'PLAYER' },
        { type: 'settings', label: 'CONFIG' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.type;
                    return (
                        <TouchableOpacity
                            key={tab.type}
                            onPress={() => onTabPress(tab.type)}
                            style={styles.tab}
                        >
                            <Text style={[
                                styles.label,
                                isActive ? styles.activeLabel : styles.inactiveLabel,
                            ]}>
                                {tab.label}
                            </Text>
                            {isActive && <View style={styles.indicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'rgba(10, 11, 15, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    container: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    activeLabel: {
        color: THEME.colors.accent,
    },
    inactiveLabel: {
        color: THEME.colors.gray[400],
    },
    indicator: {
        marginTop: 4,
        width: 12,
        height: 2,
        backgroundColor: THEME.colors.accent,
        borderRadius: 1,
    },
});
