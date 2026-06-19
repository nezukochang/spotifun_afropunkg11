import { supabase } from '../supabase/client';

export const incrementView = async (trackId: string) => {
    try {
        const { data: track, error: selectError } = await supabase.from('tracks').select('views').eq('id', trackId).single();
        if (selectError) { throw selectError; }

        if (track) {
            const { error: updateError } = await supabase.from('tracks').update({ views: (track.views || 0) + 1 }).eq('id', trackId);
            if (updateError) { throw updateError; }
        }
    } catch (error) {
        console.warn('socialService: Failed to increment views (Supabase unreachable)', error);
    }
};

export const getComments = async (trackId: string, limit: number = 10, offset: number = 0) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(username, avatar_url)')
            .eq('track_id', trackId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        return { data: data || [], error };
    } catch (error) {
        console.warn('getComments: Supabase unreachable');
        return { data: [], error: null };
    }
};

export const addComment = async (trackId: string, userId: string, content: string) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ track_id: trackId, user_id: userId, content }])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        console.warn('addComment: Supabase unreachable');
        return { data: null, error: { message: 'Network error' } };
    }
};

export const addFriend = async (userId: string, friendId: string) => {
    try {
        const { error } = await supabase
            .from('friends')
            .insert([{ user_id: userId, friend_id: friendId, status: 'accepted' }]);
        return { error };
    } catch (error) {
        console.warn('addFriend: Supabase unreachable');
        return { error: { message: 'Network error' } };
    }
};

export const getFriends = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('friends')
            .select('*, friend:profiles!friend_id(username, avatar_url)')
            .eq('user_id', userId);
        return { data: data || [], error };
    } catch (error) {
        console.warn('getFriends: Supabase unreachable');
        return { data: [], error: null };
    }
};

export const shareTrackWithFriend = async (trackId: string, friendId: string, senderId: string) => {
    try {
        const { error } = await supabase
            .from('shared_tracks')
            .insert([{
                track_id: trackId,
                recipient_id: friendId,
                sender_id: senderId,
                created_at: new Date().toISOString(),
            }]);
        return { error };
    } catch (error) {
        console.warn('shareTrackWithFriend: Supabase unreachable');
        // Don't throw - let the UI handle it gracefully
        return { error: null }; // Return success in demo mode
    }
};
