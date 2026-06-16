import { supabase } from '../supabase/client';

export const toggleFavorite = async (userId: string, trackId: string, isFavorite: boolean) => {
    if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, track_id: trackId });
        return { error };
    } else {
        // Add to favorites
        const { error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, track_id: trackId }]);
        return { error };
    }
};

export const getUserPlaylists = async (userId: string) => {
    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId);
    return { data, error };
};

export const createPlaylist = async (userId: string, name: string) => {
    const { data, error } = await supabase
        .from('playlists')
        .insert([{ user_id: userId, name }])
        .select()
        .single();
    return { data, error };
};
