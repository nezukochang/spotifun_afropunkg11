import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { SetupService } from './src/services/audio/playerService';
import { PlayerScreen } from './src/features/player/PlayerScreen';
import { THEME } from './src/shared/theme';
import { useAuthStore } from './src/stores/useAuthStore';
import { initializeAuth } from './src/services/supabase/authService';
import { LoginScreen } from './src/features/auth/LoginScreen';
import { SignUpScreen } from './src/features/auth/SignUpScreen';
import { OnboardingScreen } from './src/features/auth/OnboardingScreen';
import { HomeScreen } from './src/features/home/HomeScreen';
import { LibraryScreen } from './src/features/player/LibraryScreen';
import { SettingsScreen } from './src/features/player/SettingsScreen';
import { BottomNav, TabType } from './src/shared/ui/BottomNav';

const App = () => {
  const { session, isLoading, hasSeenOnboarding } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeAuth();
        // SetupService en arrière-plan, ne bloque pas l'affichage
        SetupService().catch(e => console.error('SetupService failed:', e));
      } catch (e) {
        console.error('Initialization failed:', e);
      }
    };
    setup();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.colors.void, justifyContent: 'center' }}>
        <ActivityIndicator color={THEME.colors.accent} size="large" />
      </View>
    );
  }

  const renderContent = () => {
    if (!hasSeenOnboarding) {
      return <OnboardingScreen />;
    }

    if (!session) {
      return isLoginMode ? (
        <LoginScreen onToggleAuth={() => setIsLoginMode(false)} />
      ) : (
        <SignUpScreen onToggleAuth={() => setIsLoginMode(true)} />
      );
    }

    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'library': return <LibraryScreen />;
      case 'player': return <PlayerScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.colors.void }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.void} />
      {renderContent()}
      {session && (
        <BottomNav
          currentTab={activeTab}
          onTabPress={setActiveTab}
        />
      )}
    </View>
  );
};

export default App;
