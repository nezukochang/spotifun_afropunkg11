import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME } from '../theme';

interface AfroPunkBackgroundProps {
    children?: React.ReactNode;
}

export const AfroPunkBackground: React.FC<AfroPunkBackgroundProps> = ({ children }) => {
    return (
        <View style={styles.container}>
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
    content: {
        flex: 1,
    },
});
