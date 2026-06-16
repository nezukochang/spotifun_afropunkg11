import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { signOut } from '../../services/supabase/authService';
import { useAuthStore } from '../../stores/useAuthStore';

export const SettingsScreen = () => {
    const { user } = useAuthStore();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) { Alert.alert('Error', error.message); }
    };

    return (
        <AfroPunkBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>CONFIG</Text>
                </View>

                <View style={styles.content}>
                    <GlassCard style={styles.profileCard}>
                        <Text style={styles.label}>CONNECTED AS</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                    </GlassCard>

                    <TouchableOpacity style={styles.option} onPress={() => { }}>
                        <Text style={styles.optionText}>DOWNLOADS (CACHE)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => { }}>
                        <Text style={styles.optionText}>AUDIO QUALITY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, styles.logout]} onPress={handleSignOut}>
                        <Text style={[styles.optionText, { color: THEME.colors.accent }]}>SIGN OUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: THEME.spacing.xl, marginTop: THEME.spacing.lg },
    title: { fontSize: 24, fontWeight: '700', color: THEME.colors.white, letterSpacing: 2 },
    content: { padding: THEME.spacing.xl },
    profileCard: { padding: THEME.spacing.lg, marginBottom: THEME.spacing.xxl },
    label: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '700', letterSpacing: 1 },
    email: { color: THEME.colors.white, fontSize: 16, marginTop: 8, fontWeight: '600' },
    option: { paddingVertical: THEME.spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
    optionText: { color: THEME.colors.white, fontWeight: '600', letterSpacing: 1 },
    logout: { marginTop: THEME.spacing.xxl, borderBottomWidth: 0 },
});
