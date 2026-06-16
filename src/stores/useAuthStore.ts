import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    hasSeenOnboarding: boolean;

    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    signOut: () => void;
    completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isLoading: true,
            hasSeenOnboarding: false,

            setSession: (session) => set({ session, user: session?.user ?? null, isLoading: false }),
            setUser: (user) => set({ user }),
            setLoading: (isLoading) => set({ isLoading }),
            signOut: () => set({ user: null, session: null, isLoading: false }),
            completeOnboarding: () => set({ hasSeenOnboarding: true }),
        }),
        {
            name: 'afropunk-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
