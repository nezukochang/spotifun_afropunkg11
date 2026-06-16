import { supabase, assertSupabaseConfigured, SUPABASE_URL } from './client';
import { useAuthStore } from '../../stores/useAuthStore';

// Supabase Auth logic
export const signUp = async (email: string, password: string) => {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.signUp(
        { email, password },
        { emailRedirectTo: SUPABASE_URL }
    );
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    useAuthStore.getState().signOut();
    return { error };
};

// Initial session check
export const initializeAuth = async () => {
    assertSupabaseConfigured();
    const { data: { session } } = await supabase.auth.getSession();
    useAuthStore.getState().setSession(session);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
        useAuthStore.getState().setSession(session);
    });
};
