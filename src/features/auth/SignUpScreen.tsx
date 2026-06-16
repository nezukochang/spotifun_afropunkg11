import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Button } from '../../shared/ui/Button';
import { signUp } from '../../services/supabase/authService';

export const SignUpScreen = ({ onToggleAuth }: { onToggleAuth: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) { return; }
        setLoading(true);
        const { error } = await signUp(email, password);
        setLoading(false);
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Check your email for validation!');
        }
    };

    return (
        <AfroPunkBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>SIGN UP</Text>
                    </View>

                    <GlassCard style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="email@example.com"
                                placeholderTextColor={THEME.colors.gray[700]}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={THEME.colors.gray[700]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <Button
                            title={loading ? 'SIGNING UP...' : 'CREATE ACCOUNT'}
                            onPress={handleSignUp}
                            variant="accent"
                            style={styles.button}
                        />

                        <Button
                            title="LOG IN INSTEAD"
                            onPress={onToggleAuth}
                            variant="outline"
                            style={styles.secondaryButton}
                        />
                    </GlassCard>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1, justifyContent: 'center', padding: THEME.spacing.xl },
    header: { alignItems: 'center', marginBottom: THEME.spacing.xxl },
    title: {
        marginTop: THEME.spacing.lg,
        fontSize: THEME.typography.sizes.xl,
        color: THEME.colors.white,
        fontWeight: '900',
        letterSpacing: 2,
    },
    card: { padding: THEME.spacing.xl },
    inputGroup: { marginBottom: THEME.spacing.lg },
    label: {
        color: THEME.colors.gray[400],
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        color: THEME.colors.white,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    button: { marginTop: THEME.spacing.md },
    secondaryButton: { marginTop: THEME.spacing.md, borderWidth: 0 },
});
