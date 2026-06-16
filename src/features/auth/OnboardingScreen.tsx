import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { AfroPunkBackground } from '../../shared/ui/AfroPunkBackground';
import { Button } from '../../shared/ui/Button';
import { useAuthStore } from '../../stores/useAuthStore';

const SLIDES = [
    {
        title: 'SPOTIFUN MUSIC',
        description: 'Discover the best music from across the globe.',
        color: THEME.colors.accent,
    },
    {
        title: 'SHARE WITH FRIENDS',
        description: 'Connect with other music lovers and share your favorite tracks.',
        color: THEME.colors.white,
    },
    {
        title: 'OFFLINE CACHING',
        description: 'Take your music anywhere, even without an internet connection.',
        color: THEME.colors.accent,
    },
];

export const OnboardingScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            completeOnboarding();
        }
    };

    const slide = SLIDES[currentSlide];

    return (
        <AfroPunkBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.topActions}>
                    <TouchableOpacity
                        onPress={completeOnboarding}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipText}>SKIP</Text>
                    </TouchableOpacity>
                </View>

                <Animated.View
                    key={currentSlide}
                    entering={FadeInRight.duration(500)}
                    exiting={FadeOutLeft.duration(500)}
                    style={styles.slideContainer}
                >
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: slide.color }]}>{slide.title}</Text>
                        <Text style={styles.description}>{slide.description}</Text>
                    </View>
                </Animated.View>

                <View style={styles.bottomActions}>
                    <View style={styles.pagination}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    i === currentSlide && styles.activeDot,
                                    i === currentSlide && { backgroundColor: slide.color },
                                ]}
                            />
                        ))}
                    </View>
                    <Button
                        title={currentSlide === SLIDES.length - 1 ? 'GET STARTED' : 'NEXT'}
                        onPress={handleNext}
                        variant="accent"
                        style={styles.nextButton}
                    />
                </View>
            </SafeAreaView>
        </AfroPunkBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topActions: {
        padding: THEME.spacing.xl,
        alignItems: 'flex-end',
    },
    skipButton: {
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    skipText: {
        fontWeight: '900',
        letterSpacing: 4,
        fontSize: 10,
    },
    slideContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: THEME.spacing.xxl,
    },
    visualContainer: {
        alignItems: 'center',
        marginBottom: THEME.spacing.xxl,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: THEME.spacing.lg,
    },
    description: {
        color: THEME.colors.white,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    bottomActions: {
        padding: THEME.spacing.xxl,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: THEME.spacing.xl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
    },
    nextButton: {
        width: '100%',
        height: 56,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
});
