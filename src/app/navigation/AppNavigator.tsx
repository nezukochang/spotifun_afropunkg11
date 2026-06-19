import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
    useSharedValue, useAnimatedStyle,
    withSpring, withTiming, interpolate,
} from 'react-native-reanimated';
import { THEME } from '../../shared/theme';
import { MiniPlayer, navigationRef } from '../../shared/ui/MiniPlayer';
import { NetworkBanner } from '../../shared/ui/NetworkBanner';

// Screens
import { HomeScreen } from '../../features/home/HomeScreen';
import { SearchScreen } from '../../features/search/SearchScreen';
import { LibraryScreen } from '../../features/player/LibraryScreen';
import { PlayerScreen } from '../../features/player/PlayerScreen';
import { SettingsScreen } from '../../features/player/SettingsScreen';

// ─── Tab config ──────────────────────────────────────────────
const TAB_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
    Home:     { label: 'HOME',    icon: '♫', color: THEME.colors.accent },
    Search:   { label: 'SEARCH',  icon: '◎', color: THEME.colors.accentGold },
    Library:  { label: 'LIBRARY', icon: '▤', color: THEME.colors.accentViolet },
    Player:   { label: 'PLAYER',  icon: '▶', color: THEME.colors.accent },
    Settings: { label: 'CONFIG',  icon: '⚙', color: THEME.colors.accentEmerald },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const config = TAB_CONFIG[name] || { icon: '?', label: name, color: THEME.colors.accent };
    const scale = useSharedValue(focused ? 1 : 0.9);
    const glow = useSharedValue(focused ? 1 : 0);

    // Update shared values when focused changes
    React.useEffect(() => {
        scale.value = withSpring(focused ? 1 : 0.9, { damping: 15 });
        glow.value = withTiming(focused ? 1 : 0, { duration: 250 });
    }, [focused]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glow.value,
        transform: [{ scaleX: interpolate(glow.value, [0, 1], [0.3, 1]) }],
    }));

    return (
        <View style={tabStyles.container}>
            <Animated.View style={iconStyle}>
                <Text style={[tabStyles.icon, { color: focused ? config.color : THEME.colors.gray[500] }]}>
                    {config.icon}
                </Text>
            </Animated.View>
            <Text style={[tabStyles.label, focused && { color: config.color }]}>
                {config.label}
            </Text>
            {/* Floating pill indicator */}
            <Animated.View style={[tabStyles.pill, { backgroundColor: config.color }, glowStyle]} />
        </View>
    );
}

const tabStyles = StyleSheet.create({
    container: {
        alignItems: 'center', justifyContent: 'center',
        paddingTop: 4, paddingBottom: 2, minWidth: 56,
    },
    icon: { fontSize: 20, marginBottom: 2 },
    label: {
        fontSize: 8, fontWeight: '900', letterSpacing: 1.5,
        color: THEME.colors.gray[500],
    },
    pill: {
        marginTop: 4, width: 16, height: 3,
        borderRadius: 2,
    },
});

// ─── Bottom Tabs ─────────────────────────────────────────────
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: { name: string } }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon name={route.name} focused={focused} />,
                tabBarStyle: {
                    backgroundColor: 'rgba(12, 12, 18, 0.97)',
                    borderTopWidth: 0,
                    height: 70,
                    paddingBottom: 6,
                    paddingTop: 2,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: THEME.colors.accent,
                tabBarInactiveTintColor: THEME.colors.gray[500],
            })}
        >
            <Tab.Screen name="Home"     component={HomeScreen} />
            <Tab.Screen name="Search"   component={SearchScreen} />
            <Tab.Screen name="Library"  component={LibraryScreen} />
            <Tab.Screen name="Player"   component={PlayerScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

// ─── Root Stack ──────────────────────────────────────────────
const Stack = createNativeStackNavigator();

export function AppNavigator() {
    const [activeRoute, setActiveRoute] = useState<string>('Home');

    const handleStateChange = useCallback(() => {
        const nav = navigationRef.current;
        if (nav) {
            const route = nav.getCurrentRoute() as any;
            if (route?.name) { setActiveRoute(route.name); }
        }
    }, []);

    const showMiniPlayer = activeRoute !== 'Player';

    return (
        <NavigationContainer
            ref={navigationRef}
            onStateChange={handleStateChange}
            theme={{
                dark: true,
                colors: {
                    primary: THEME.colors.accent,
                    background: THEME.colors.void,
                    card: THEME.colors.void,
                    text: THEME.colors.white,
                    border: 'rgba(255,255,255,0.05)',
                    notification: THEME.colors.accent,
                },
                fonts: {
                    regular:   { fontFamily: 'System', fontWeight: '400' },
                    medium:    { fontFamily: 'System', fontWeight: '500' },
                    bold:      { fontFamily: 'System', fontWeight: '700' },
                    heavy:     { fontFamily: 'System', fontWeight: '900' },
                },
            }}
        >
            <View style={{ flex: 1, backgroundColor: THEME.colors.void }}>
                <NetworkBanner />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                </Stack.Navigator>
                {showMiniPlayer && <MiniPlayer />}
            </View>
        </NavigationContainer>
    );
}
