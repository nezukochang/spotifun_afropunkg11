import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Curated African photography — landscapes, textiles, culture, skies
const SLIDESHOW_IMAGES = [
    // African landscapes & nature
    'https://images.unsplash.com/photo-1516026672322-bc52d61a7a55?w=800&q=60',
    // Kente cloth / textiles (Ghana)
    'https://images.unsplash.com/photo-1590123715937-e31b48a37c0c?w=800&q=60',
    // African sunset over savanna
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=60',
    // Traditional mud cloth patterns (Mali)
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=60',
    // African market scene
    'https://images.unsplash.com/photo-1504386106330-4e766e4104a1?w=800&q=60',
    // Baobab tree at sunset
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=60',
    // Colorful African fabric
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=60',
    // Lagos / West African urban vibe
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=60',
    // Kenyan savanna
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=60',
    // African drum / percussion
    'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=60',
];

const CROSSFADE_DURATION = 9000; // 9 seconds per image
const FADE_DURATION = 1800; // 1.8s crossfade

interface AfricanSlideshowProps {
    visible?: boolean;
}

// ─── Single fading layer ────────────────────────────────────
const FadeLayer = ({ uri, opacity }: { uri: string; opacity: Animated.SharedValue<number> }) => {
    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, style]}>
            <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
                blurRadius={3}
            />
        </Animated.View>
    );
};

export const AfricanSlideshow: React.FC<AfricanSlideshowProps> = ({ visible = true }) => {
    const [indexA, setIndexA] = useState(0);
    const [indexB, setIndexB] = useState(1);
    const [showingA, setShowingA] = useState(true);

    const opacityA = useSharedValue(1);
    const opacityB = useSharedValue(0);

    const advanceSlide = useCallback(() => {
        if (!visible) { return; }

        if (showingA) {
            const nextB = (indexA + 1) % SLIDESHOW_IMAGES.length;
            setIndexB(nextB);
            opacityB.value = 0;
            opacityB.value = withTiming(1, { duration: FADE_DURATION, easing: Easing.inOut(Easing.ease) });
            opacityA.value = withTiming(0, { duration: FADE_DURATION, easing: Easing.inOut(Easing.ease) });
            setShowingA(false);
        } else {
            const nextA = (indexB + 1) % SLIDESHOW_IMAGES.length;
            setIndexA(nextA);
            opacityA.value = 0;
            opacityA.value = withTiming(1, { duration: FADE_DURATION, easing: Easing.inOut(Easing.ease) });
            opacityB.value = withTiming(0, { duration: FADE_DURATION, easing: Easing.inOut(Easing.ease) });
            setShowingA(true);
        }
    }, [showingA, indexA, indexB, visible, opacityA, opacityB]);

    useEffect(() => {
        if (!visible) { return; }

        const interval = setInterval(() => {
            advanceSlide();
        }, CROSSFADE_DURATION);

        return () => clearInterval(interval);
    }, [advanceSlide, visible]);

    if (!visible) { return null; }

    return (
        <Animated.View style={styles.container}>
            <FadeLayer uri={SLIDESHOW_IMAGES[indexA]} opacity={opacityA} />
            <FadeLayer uri={SLIDESHOW_IMAGES[indexB]} opacity={opacityB} />
            {/* Softer dim overlay with warm African earth tones */}
            <Animated.View style={styles.dimOverlay} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    image: {
        width: SCREEN_W,
        height: SCREEN_H,
    },
    dimOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 12, 8, 0.78)',
    },
});
