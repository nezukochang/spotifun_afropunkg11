import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const env = typeof process !== 'undefined' ? process.env : undefined;

// Supabase project settings
const SUPABASE_URL = env?.SUPABASE_URL || 'https://cmusorramnhcwqblxtyu.supabase.co';
const SUPABASE_ANON_KEY = env?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtdXNvcnJhbW5oY3dxYmx4dHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM1NjUsImV4cCI6MjA5NzE0OTU2NX0.aX1SglP6A_ssCmVxVmZzgneHVzjB2cH-URXTcIWPyp8';

const isSupabaseConfigured =
    SUPABASE_URL !== '' &&
    SUPABASE_ANON_KEY !== '';

if (!isSupabaseConfigured) {
    console.warn(
        '[Supabase] Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY in src/services/supabase/client.ts or use an env solution.'
    );
}

export const assertSupabaseConfigured = () => {
    if (!isSupabaseConfigured) {
        throw new Error(
            '[Supabase] Missing or placeholder credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY before calling auth methods.'
        );
    }
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
    },
});

export { SUPABASE_URL };

export const mockSupabase = {
    auth: {
        signIn: async () => ({ data: { user: { id: 'mock-user' } }, error: null }),
        signOut: async () => ({ error: null }),
    },
};
