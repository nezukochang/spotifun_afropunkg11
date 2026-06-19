import React, { useEffect } from 'react';
import { StatusBar, ActivityIndicator, View, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SetupService } from './src/services/audio/playerService';
import { registerPlayerEventListeners } from './src/stores/usePlayerStore';
import { useThemeStore } from './src/stores/useThemeStore';
import { useI18nStore } from './src/shared/i18n/useI18nStore';
import { useAuthStore } from './src/stores/useAuthStore';
import { initializeAuth } from './src/services/supabase/authService';
import { LoginScreen } from './src/features/auth/LoginScreen';
import { SignUpScreen } from './src/features/auth/SignUpScreen';
import { OnboardingScreen } from './src/features/auth/OnboardingScreen';
import { AppNavigator } from './src/app/navigation/AppNavigator';
import { ErrorBoundary } from './src/shared/ui/ErrorBoundary';
import { AmbientProvider } from './src/services/audio/AmbientProvider';

// Suppress non-critical warnings
LogBox.ignoreLogs([
  'startHeadlessTask',
  'registerCallableModule',
  'Passing an object as the argument',
  'Network request failed',
]);

const App = () => {
  const { session, isLoading, hasSeenOnboarding } = useAuthStore();
  const { colors, loadTheme } = useThemeStore();
  const { loadLocale } = useI18nStore();

  useEffect(() => {
    const setup = async () => {
      try {
        await Promise.all([loadTheme(), loadLocale()]);
      } catch {}
      try {
        await initializeAuth();
      } catch (e) {
        console.warn('[App] Auth init failed:', e);
      }
      try {
        const ready = await SetupService();
        if (ready) {
          registerPlayerEventListeners();
        }
      } catch (e) {
        console.warn('[App] TrackPlayer setup failed:', e);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    if (!session) { return; }
    let unsubscribe: (() => void) | undefined;
    try {
      const { subscribeToPlayback } = require('./src/services/supabase/realtimeService');
      unsubscribe = subscribeToPlayback((remoteState: any) => {
        console.log('[Realtime] Remote playback:', remoteState.trackId);
      });
    } catch {}
    return () => { if (unsubscribe) { unsubscribe(); } };
  }, [session]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.void, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.void} />
        <OnboardingScreen />
      </GestureHandlerRootView>
    );
  }

  if (!session) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.void} />
        <AuthFlow />
      </GestureHandlerRootView>
    );
  }

  return (
    <ErrorBoundary name="Root">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.void} />
        <AmbientProvider>
          <AppNavigator />
        </AmbientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const AuthFlow = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  return (
    <ErrorBoundary name="AuthFlow">
      {isLogin
        ? <LoginScreen onToggleAuth={() => setIsLogin(false)} />
        : <SignUpScreen onToggleAuth={() => setIsLogin(true)} />}
    </ErrorBoundary>
  );
};

export default App;
