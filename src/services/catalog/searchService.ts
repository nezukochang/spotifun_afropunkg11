import { supabase } from '../supabase/client';
import { getCatalog, AfroTrack } from './catalogService';
import { SearchResults, Artist, Album, RecentSearch, AfropunkTrack } from '../../types';
import { RECENT_SEARCHES_KEY, MAX_RECENT_SEARCHES } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Full-text search ────────────────────────────────────────
export const searchTracks = async (query: string): Promise<SearchResults> => {
    const q = query.trim().toLowerCase();
    if (!q) { return { tracks: [], artists: [], albums: [] }; }

    // Try Supabase first
    try {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .or(`title.ilike.%${q}%,artist.ilike.%${q}%,genre.ilike.%${q}%`)
            .limit(30);

        if (!error && data && data.length > 0) {
            return buildResults(data as AfroTrack[]);
        }
    } catch (e) {
        console.warn('searchTracks: Supabase failed, falling back to local', e);
    }

    // Fallback: client-side search on mock catalog
    const catalog = await getCatalog();
    const matches = catalog.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.artist && t.artist.toLowerCase().includes(q)) ||
        (t.genre && t.genre.toLowerCase().includes(q))
    );

    return buildResults(matches);
};

function buildResults(tracks: AfroTrack[]): SearchResults {
    // Extract unique artists
    const artistMap = new Map<string, Artist>();
    tracks.forEach(t => {
        const name = t.artist || 'Unknown';
        if (!artistMap.has(name)) {
            artistMap.set(name, {
                id: `artist-${name}`,
                name,
                genres: [t.genre as any],
                followerCount: 0,
            });
        }
    });

    return {
        tracks: tracks as unknown as AfropunkTrack[],
        artists: Array.from(artistMap.values()),
        albums: [], // Albums not yet modeled in mock data
    };
}

// ─── Recent searches ─────────────────────────────────────────
export const getRecentSearches = async (): Promise<RecentSearch[]> => {
    try {
        const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const addRecentSearch = async (query: string): Promise<void> => {
    try {
        const existing = await getRecentSearches();
        const filtered = existing.filter(s => s.query !== query);
        const updated: RecentSearch[] = [
            { query, timestamp: Date.now() },
            ...filtered,
        ].slice(0, MAX_RECENT_SEARCHES);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
        console.warn('addRecentSearch failed', e);
    }
};

export const clearRecentSearches = async (): Promise<void> => {
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
};
