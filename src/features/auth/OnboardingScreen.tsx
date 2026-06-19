import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    FadeInRight, FadeOutLeft, FadeInUp,
    useSharedValue, useAnimatedStyle,
    withRepeat, withSequence, withTiming, withSpring,
    Easing, interpolate,
} from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { Button } from '../../shared/ui/Button';
import { PulseGlow, SpringBounce } from '../../shared/ui/Animations';
import { useAuthStore } from '../../stores/useAuthStore';

const { width: SCREEN_W } = Dimensions.get('window');

export const OnboardingScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);
    const { colors } = useThemeStore();
    const { t } = useI18nStore();

    const SLIDES = [
        {
            title: t.onboarding1Title,
            subtitle: 'SPOTIFUN MUSIC',
            description: t.onboarding1Desc,
            accentColor: colors.accent,
            icon: '♫',
        },
        {
            title: t.onboarding2Title,
            subtitle: 'SHARE WITH FRIENDS',
            description: t.onboarding2Desc,
            accentColor: colors.accentSecondary,
            icon: '◎',
        },
        {
            title: t.onboarding3Title,
            subtitle: 'ANYWHERE, ANYTIME',
            description: t.onboarding3Desc,
            accentColor: colors.accentTertiary,
            icon: '↓',
        },
    ];

    // Animated background pulse
    const bgPulse = useSharedValue(0);
    useEffect(() => {
        bgPulse.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            ),
            -1, false,
        );
    }, []);

    const bgStyle = useAnimatedStyle(() => ({
        opacity: interpolate(bgPulse.value, [0, 1], [0.03, 0.08]),
    }));

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            completeOnboarding();
        }
    };

    const slide = SLIDES[currentSlide];

    return (
        <AfroPunkBackground showSlideshow>
            <SafeAreaView style={styles.container}>
                {/* Background glow */}
                <Animated.View style={[styles.bgGlow, { backgroundColor: slide.accentColor }, bgStyle]} />

                {/* Skip button */}
                <View style={styles.topActions}>
                    <TouchableOpacity
                        onPress={completeOnboarding}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={styles.skipButton}
                    >
                        <Text style={[styles.skipText, { color: colors.gray[400] }]}>{t.skip.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                {/* Slide content */}
                <Animated.View
                    key={currentSlide}
                    entering={FadeInRight.duration(500).springify().damping(16)}
                    exiting={FadeOutLeft.duration(400)}
                    style={styles.slideContainer}
                >
                    <View style={styles.content}>
                        {/* Large icon */}
                        <SpringBounce>
                            <View style={[styles.iconCircle, { borderColor: slide.accentColor }]}>
                                <Text style={[styles.slideIcon, { color: slide.accentColor }]}>
                                    {slide.icon}
                                </Text>
                            </View>
                        </SpringBounce>

                        <Text style={[styles.title, { color: slide.accentColor }]}>{slide.title}</Text>
                        <Text style={[styles.subtitle, { color: colors.gray[300] }]}>{slide.subtitle}</Text>
                        <Text style={[styles.description, { color: colors.gray[300] }]}>{slide.description}</Text>
                    </View>
                </Animated.View>

                {/* Bottom actions */}
                <Animated.View entering={FadeInUp.delay(300)} style={styles.bottomActions}>
                    {/* Pagination */}
                    <View style={styles.pagination}>
                        {SLIDES.map((_, i) => (
                            <View key={i} style={styles.dotWrap}>
                                <View
                                    style={[
                                        styles.dot,
                                        i === currentSlide && [styles.activeDot, { backgroundColor: SLIDES[i].accentColor }],
                                        i < currentSlide && { backgroundColor: THEME.colors.gray[500] },
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    <Button
                        title={currentSlide === SLIDES.length - 1 ? t.getStarted : t.next}
                        onPress={handleNext}
                        variant={currentSlide === SLIDES.length - 1 ? 'accent' : 'outline'}
                        style={styles.nextButton}
                        size="lg"
                    />
                </Animated.View>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    bgGlow: {
        ...StyleSheet.absoluteFillObject,
    },

    topActions: {
        padding: THEME.spacing.xl, alignItems: 'flex-end',
    },
    skipButton: {
        paddingVertical: THEME.spacing.sm, paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.sm,
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    skipText: { fontWeight: '900', letterSpacing: 4, fontSize: 10, color: THEME.colors.gray[400] },

    slideContainer: {
        flex: 1, justifyContent: 'center',
        paddingHorizontal: THEME.spacing.xxl,
    },
    content: { alignItems: 'center' },

    iconCircle: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 2, justifyContent: 'center', alignItems: 'center',
        marginBottom: THEME.spacing.xxl,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    slideIcon: { fontSize: 40 },

    title: {
        fontSize: THEME.typography.sizes.xxl, fontWeight: '900',
        letterSpacing: 6, textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.typography.sizes.sm, fontWeight: '800',
        color: THEME.colors.gray[300], letterSpacing: 3,
        textAlign: 'center', marginBottom: THEME.spacing.xl,
    },
    description: {
        color: THEME.colors.gray[300], textAlign: 'center',
        fontSize: 15, lineHeight: 24, opacity: 0.85,
        maxWidth: 300,
    },

    bottomActions: {
        padding: THEME.spacing.xxl, alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row', marginBottom: THEME.spacing.xl,
    },
    dotWrap: { padding: 4 },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    activeDot: { width: 24 },

    nextButton: { width: SCREEN_W - 96 },
});
