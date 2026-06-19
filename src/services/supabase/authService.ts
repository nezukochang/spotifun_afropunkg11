import { supabase, assertSupabaseConfigured, SUPABASE_URL } from './client';
import { useAuthStore } from '../../stores/useAuthStore';

// Demo mode: creates a fake session when Supabase is unreachable
const DEMO_USER = {
    id: 'demo-user-spotifun',
    email: 'demo@spotifunafropunk.app',
    app_metadata: {},
    user_metadata: { display_name: 'Demo User' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
};

const createDemoSession = () => ({
    access_token: 'demo-token',
    refresh_token: 'demo-refresh',
    expires_in: 3600,
    token_type: 'bearer',
    user: DEMO_USER as any,
});

const isDemoMode = { value: false };

export const isDemoModeActive = () => isDemoMode.value;

// Supabase Auth logic with demo fallback
export const signUp = async (email: string, password: string) => {
    try {
        assertSupabaseConfigured();
        const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { emailRedirectTo: SUPABASE_URL },
        });

        // If network error, fall back to demo mode
        if (error && (error.message.includes('Network') || error.message.includes('fetch') || error.message.includes('Failed'))) {
            return enterDemoMode(email);
        }
        return { data, error };
    } catch (e: any) {
        // Network error -> demo mode
        if (e?.message?.includes('Network') || e?.message?.includes('fetch')) {
            return enterDemoMode(email);
        }
        return { data: null, error: { message: e?.message || 'Unknown error' } };
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        assertSupabaseConfigured();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        // If network error, fall back to demo mode
        if (error && (error.message.includes('Network') || error.message.includes('fetch') || error.message.includes('Failed'))) {
            return enterDemoMode(email);
        }
        return { data, error };
    } catch (e: any) {
        // Network error -> demo mode
        if (e?.message?.includes('Network') || e?.message?.includes('fetch')) {
            return enterDemoMode(email);
        }
        return { data: null, error: { message: e?.message || 'Unknown error' } };
    }
};

const enterDemoMode = (email?: string) => {
    isDemoMode.value = true;
    const session = createDemoSession();
    if (email) { session.user = { ...session.user, email } as any; }
    useAuthStore.getState().setSession(session as any);
    console.log('[Auth] Demo mode activated (Supabase unreachable)');
    return { data: { session, user: session.user }, error: null };
};

export const signOut = async () => {
    if (isDemoMode.value) {
        isDemoMode.value = false;
        useAuthStore.getState().signOut();
        return { error: null };
    }
    try {
        const { error } = await supabase.auth.signOut();
        useAuthStore.getState().signOut();
        return { error };
    } catch {
        useAuthStore.getState().signOut();
        return { error: null };
    }
};

// Initial session check
export const initializeAuth = async () => {
    try {
        assertSupabaseConfigured();
        const { data: { session } } = await supabase.auth.getSession();
        useAuthStore.getState().setSession(session);

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            if (!isDemoMode.value) {
                useAuthStore.getState().setSession(session);
            }
        });
    } catch (e: any) {
        // Supabase not reachable - set loading false, user can still use demo mode
        console.warn('[Auth] Supabase unreachable, demo mode available:', e?.message);
        useAuthStore.getState().setSession(null);
    }
};
