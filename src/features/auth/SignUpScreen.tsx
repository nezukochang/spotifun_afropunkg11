import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { GlassCard } from '../../shared/ui/GlassCard';
import { Button } from '../../shared/ui/Button';
import { signUp } from '../../services/supabase/authService';

const LOGO = require('../../assets/images/afropunk_logo.png');

export const SignUpScreen = ({ onToggleAuth }: { onToggleAuth: () => void }) => {
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const pulse = useSharedValue(0);
    React.useEffect(() => {
        pulse.value = withRepeat(withTiming(1, { duration: 2500 }), -1, true);
    }, []);
    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulse.value, [0, 1], [0.2, 0.6]),
        transform: [{ scale: interpolate(pulse.value, [0, 1], [0.9, 1.1]) }],
    }));

    const handleSignUp = async () => {
        if (!email || !password) { return; }
        setLoading(true);
        const { error } = await signUp(email, password);
        setLoading(false);
        if (error) {
            Alert.alert(t.error, error.message);
        } else {
            Alert.alert(t.success, t.checkEmail);
        }
    };

    return (
        <AfroPunkBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                        <Animated.View style={[styles.logoGlow, { shadowColor: colors.accentSecondary }, glowStyle]} />
                        <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
                        <Text style={[styles.brandName, { color: colors.white }]}>SPOTIFUN AFROPUNK</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(300).springify()}>
                        <GlassCard style={styles.card} variant="gold" glow>
                            <Text style={[styles.welcomeText, { color: colors.accentSecondary }]}>{t.createAccount}</Text>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.gray[400] }]}>{t.email.toUpperCase()}</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.white, borderColor: colors.glassBorder }]}
                                    placeholder="email@example.com"
                                    placeholderTextColor={colors.gray[700]}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.gray[400] }]}>{t.password.toUpperCase()}</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.white, borderColor: colors.glassBorder }]}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.gray[700]}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <Button
                                title={loading ? '...' : t.signUp.toUpperCase()}
                                onPress={handleSignUp}
                                variant="accent"
                                style={styles.button}
                            />

                            <Button
                                title={t.login.toUpperCase()}
                                onPress={onToggleAuth}
                                variant="outline"
                                style={styles.secondaryButton}
                            />
                        </GlassCard>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1, justifyContent: 'center', padding: THEME.spacing.xl },
    header: { alignItems: 'center', marginBottom: THEME.spacing.xxl },
    logoGlow: {
        position: 'absolute', width: 110, height: 110, borderRadius: 55,
        shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30,
        elevation: 15,
    },
    logoImage: { width: 100, height: 100, borderRadius: 16 },
    brandName: { fontSize: 28, fontWeight: '900', letterSpacing: 6, marginTop: THEME.spacing.sm },
    welcomeText: { fontSize: 12, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginBottom: THEME.spacing.lg },
    card: { padding: THEME.spacing.xl },
    inputGroup: { marginBottom: THEME.spacing.lg },
    label: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        borderWidth: 1,
    },
    button: { marginTop: THEME.spacing.md },
    secondaryButton: { marginTop: THEME.spacing.md, borderWidth: 0 },
});
