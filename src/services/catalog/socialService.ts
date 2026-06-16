import { supabase } from '../supabase/client';

export const incrementView = async (trackId: string) => {
    try {
        // In a real app, this might be a RPC call to handle atomic increments
        const { data: track, error: selectError } = await supabase.from('tracks').select('views').eq('id', trackId).single();
        if (selectError) { throw selectError; }

        if (track) {
            const { error: updateError } = await supabase.from('tracks').update({ views: (track.views || 0) + 1 }).eq('id', trackId);
            if (updateError) { throw updateError; }
        }
    } catch (error) {
        console.warn('socialService: Failed to increment views (likely missing tracks table)', error);
    }
};

export const getComments = async (trackId: string, limit: number = 10, offset: number = 0) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('track_id', trackId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    return { data, error };
};

export const addFriend = async (userId: string, friendId: string) => {
    const { error } = await supabase
        .from('friends')
        .insert([{ user_id: userId, friend_id: friendId, status: 'accepted' }]);
    return { error };
};

export const getFriends = async (userId: string) => {
    const { data, error } = await supabase
        .from('friends')
        .select('*, friend:profiles!friend_id(username, avatar_url)')
        .eq('user_id', userId);
    return { data, error };
};
export const shareTrackWithFriend = async (trackId: string, friendId: string, senderId: string) => {
    // In a real app, this would insert into a 'shared_tracks' or 'messages' table
    const { error } = await supabase
        .from('shared_tracks')
        .insert([{
            track_id: trackId,
            recipient_id: friendId,
            sender_id: senderId,
            created_at: new Date().toISOString(),
        }]);
    return { error };
};
