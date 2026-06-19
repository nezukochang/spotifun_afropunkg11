import { supabase } from '../supabase/client';
import { Playlist, AfropunkTrack } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYLISTS_KEY = 'spotifun-afropunk_local_playlists';
const LIKED_KEY = 'spotifun-afropunk_local_liked';
const HISTORY_KEY = 'spotifun-afropunk_local_history';

// Helper: get local playlists from AsyncStorage
const getLocalPlaylists = async (userId: string): Promise<Playlist[]> => {
    try {
        const raw = await AsyncStorage.getItem(`${PLAYLISTS_KEY}_${userId}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalPlaylists = async (userId: string, playlists: Playlist[]) => {
    await AsyncStorage.setItem(`${PLAYLISTS_KEY}_${userId}`, JSON.stringify(playlists));
};

// Helper: get local likeded track IDs
const getLocalLikedIds = async (userId: string): Promise<string[]> => {
    try {
        const raw = await AsyncStorage.getItem(`${LIKED_KEY}_${userId}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalLikedIds = async (userId: string, ids: string[]) => {
    await AsyncStorage.setItem(`${LIKED_KEY}_${userId}`, JSON.stringify(ids));
};

// Helper: local history
const getLocalHistory = async (userId: string): Promise<string[]> => {
    try {
        const raw = await AsyncStorage.getItem(`${HISTORY_KEY}_${userId}`);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalHistory = async (userId: string, ids: string[]) => {
    await AsyncStorage.setItem(`${HISTORY_KEY}_${userId}`, JSON.stringify(ids));
};

// ─── Favorites ───────────────────────────────────────────────
export const toggleFavorite = async (userId: string, trackId: string, isFavorite: boolean) => {
    try {
        const likedIds = await getLocalLikedIds(userId);
        if (isFavorite) {
            const updated = likedIds.filter(id => id !== trackId);
            await saveLocalLikedIds(userId, updated);
        } else {
            if (!likedIds.includes(trackId)) {
                await saveLocalLikedIds(userId, [trackId, ...likedIds]);
            }
        }
    } catch (e) {
        console.warn('toggleFavorite failed:', e);
    }

    // Also try Supabase (non-blocking)
    try {
        if (isFavorite) {
            await supabase.from('favorites').delete().match({ user_id: userId, track_id: trackId });
        } else {
            await supabase.from('favorites').insert([{ user_id: userId, track_id: trackId }]);
        }
    } catch { /* Supabase unreachable, local storage is primary */ }

    return { error: null };
};

export const getLikedTracks = async (userId: string): Promise<AfropunkTrack[]> => {
    // Return empty for now (track details not stored locally)
    return [];
};

export const getLikedTrackIds = async (userId: string): Promise<string[]> => {
    // Try Supabase first, fallback to local
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('track_id')
            .eq('user_id', userId);

        if (!error && data) { return data.map(d => d.track_id); }
    } catch { /* fallthrough to local */ }

    return getLocalLikedIds(userId);
};

// ─── Playlists ───────────────────────────────────────────────
export const getUserPlaylists = async (userId: string) => {
    // Try Supabase first
    try {
        const { data, error } = await supabase
            .from('playlists')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (!error && data) { return { data: data as Playlist[] | null, error }; }
    } catch { /* fallthrough to local */ }

    const local = await getLocalPlaylists(userId);
    return { data: local.length > 0 ? local : null, error: null };
};

export const createPlaylist = async (userId: string, name: string, description?: string) => {
    const newPlaylist: Playlist = {
        id: `local-${Date.now()}`,
        name,
        userId,
        description: description || '',
        isPublic: false,
        trackIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Save locally
    const playlists = await getLocalPlaylists(userId);
    playlists.unshift(newPlaylist);
    await saveLocalPlaylists(userId, playlists);

    // Also try Supabase (non-blocking)
    try {
        await supabase
            .from('playlists')
            .insert([{ user_id: userId, name, description, is_public: false }]);
    } catch { /* local is primary */ }

    return { data: newPlaylist, error: null };
};

export const deletePlaylist = async (playlistId: string) => {
    // Try to find in local storage and remove
    try {
        // We need to check all possible user keys - for simplicity, use current user
        const keys = await AsyncStorage.getAllKeys();
        for (const key of keys) {
            if (key.startsWith(PLAYLISTS_KEY + '_')) {
                const raw = await AsyncStorage.getItem(key);
                if (raw) {
                    const playlists: Playlist[] = JSON.parse(raw);
                    const filtered = playlists.filter(p => p.id !== playlistId);
                    if (filtered.length !== playlists.length) {
                        await AsyncStorage.setItem(key, JSON.stringify(filtered));
                    }
                }
            }
        }
    } catch { /* ignore */ }

    try {
        await supabase.from('playlist_tracks').delete().eq('playlist_id', playlistId);
        await supabase.from('playlists').delete().eq('id', playlistId);
    } catch { /* local is primary */ }

    return { error: null };
};

export const renamePlaylist = async (playlistId: string, name: string) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        for (const key of keys) {
            if (key.startsWith(PLAYLISTS_KEY + '_')) {
                const raw = await AsyncStorage.getItem(key);
                if (raw) {
                    const playlists: Playlist[] = JSON.parse(raw);
                    const idx = playlists.findIndex(p => p.id === playlistId);
                    if (idx >= 0) {
                        playlists[idx].name = name;
                        playlists[idx].updatedAt = new Date().toISOString();
                        await AsyncStorage.setItem(key, JSON.stringify(playlists));
                    }
                }
            }
        }
    } catch { /* ignore */ }

    try {
        await supabase
            .from('playlists')
            .update({ name, updated_at: new Date().toISOString() })
            .eq('id', playlistId);
    } catch { /* local is primary */ }

    return { error: null };
};

export const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        for (const key of keys) {
            if (key.startsWith(PLAYLISTS_KEY + '_')) {
                const raw = await AsyncStorage.getItem(key);
                if (raw) {
                    const playlists: Playlist[] = JSON.parse(raw);
                    const idx = playlists.findIndex(p => p.id === playlistId);
                    if (idx >= 0 && !playlists[idx].trackIds.includes(trackId)) {
                        playlists[idx].trackIds.push(trackId);
                        playlists[idx].updatedAt = new Date().toISOString();
                        await AsyncStorage.setItem(key, JSON.stringify(playlists));
                    }
                }
            }
        }
    } catch { /* ignore */ }

    try {
        await supabase.from('playlist_tracks').insert([{ playlist_id: playlistId, track_id: trackId }]);
        await supabase.from('playlists').update({ updated_at: new Date().toISOString() }).eq('id', playlistId);
    } catch { /* local is primary */ }

    return { error: null };
};

export const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        for (const key of keys) {
            if (key.startsWith(PLAYLISTS_KEY + '_')) {
                const raw = await AsyncStorage.getItem(key);
                if (raw) {
                    const playlists: Playlist[] = JSON.parse(raw);
                    const idx = playlists.findIndex(p => p.id === playlistId);
                    if (idx >= 0) {
                        playlists[idx].trackIds = playlists[idx].trackIds.filter(id => id !== trackId);
                        playlists[idx].updatedAt = new Date().toISOString();
                        await AsyncStorage.setItem(key, JSON.stringify(playlists));
                    }
                }
            }
        }
    } catch { /* ignore */ }

    try {
        await supabase.from('playlist_tracks').delete().match({ playlist_id: playlistId, track_id: trackId });
    } catch { /* local is primary */ }

    return { error: null };
};

export const getPlaylistTracks = async (playlistId: string): Promise<AfropunkTrack[]> => {
    try {
        const { data, error } = await supabase
            .from('playlist_tracks')
            .select('tracks(*)')
            .eq('playlist_id', playlistId)
            .order('position', { ascending: true });

        if (!error && data) {
            return (data as any[]).map(d => d.tracks).filter(Boolean) as AfropunkTrack[];
        }
    } catch { /* fallthrough */ }

    return [];
};

// ─── Recently played ─────────────────────────────────────────
export const recordPlayback = async (userId: string, trackId: string) => {
    try {
        const history = await getLocalHistory(userId);
        const filtered = history.filter(id => id !== trackId);
        await saveLocalHistory(userId, [trackId, ...filtered].slice(0, 50));
    } catch { /* ignore */ }

    try {
        await supabase
            .from('play_history')
            .insert([{ user_id: userId, track_id: trackId, played_at: new Date().toISOString() }]);
    } catch { /* local is primary */ }
};

export const getRecentlyPlayed = async (userId: string, limit: number = 10): Promise<AfropunkTrack[]> => {
    try {
        const { data, error } = await supabase
            .from('play_history')
            .select('tracks(*)')
            .eq('user_id', userId)
            .order('played_at', { ascending: false })
            .limit(limit);

        if (!error && data) {
            return (data as any[]).map(d => d.tracks).filter(Boolean) as AfropunkTrack[];
        }
    } catch { /* fallthrough */ }

    return [];
};
