import { supabase } from './client';
import { useAuthStore } from '../../stores/useAuthStore';
import { NowPlayingState } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'spotifun-afropunk-device-id';
let deviceId: string | null = null;
let realtimeChannel: any = null;
let onRemoteChange: ((state: NowPlayingState) => void) | null = null;

// ─── Device ID ───────────────────────────────────────────────
async function getDeviceId(): Promise<string> {
    if (deviceId) { return deviceId; }
    let stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!stored) {
        stored = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        await AsyncStorage.setItem(DEVICE_ID_KEY, stored);
    }
    deviceId = stored;
    return stored;
}

// ─── Publish now-playing state ───────────────────────────────
export const syncNowPlaying = async (
    trackId: string | null,
    positionMs: number,
    isPlaying: boolean,
): Promise<void> => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) { return; }

    const state: NowPlayingState & { user_id: string } = {
        trackId,
        positionMs,
        isPlaying,
        deviceId: await getDeviceId(),
        timestamp: Date.now(),
        user_id: userId,
    };

    try {
        // Use a Supabase broadcast channel via Realtime
        // In production, this would use the Realtime presence/broadcast API
        await supabase.channel(`now_playing:${userId}`)
            .send({
                type: 'broadcast',
                event: 'playback_change',
                payload: state,
            });
    } catch (e) {
        console.warn('syncNowPlaying failed:', e);
    }
};

// ─── Subscribe to remote playback changes ────────────────────
export const subscribeToPlayback = (callback: (state: NowPlayingState) => void): (() => void) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) { return () => {}; }

    onRemoteChange = callback;
    const thisDeviceId = deviceId;

    // Clean up previous channel
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
    }

    realtimeChannel = supabase
        .channel(`now_playing:${userId}`)
        .on('broadcast', { event: 'playback_change' }, ({ payload }: { payload: NowPlayingState & { user_id: string } }) => {
            // Ignore events from this device
            if (payload.deviceId === thisDeviceId) { return; }
            if (onRemoteChange) {
                onRemoteChange({
                    trackId: payload.trackId,
                    positionMs: payload.positionMs,
                    isPlaying: payload.isPlaying,
                    deviceId: payload.deviceId,
                    timestamp: payload.timestamp,
                });
            }
        })
        .subscribe();

    // Return cleanup function
    return () => {
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
            realtimeChannel = null;
        }
        onRemoteChange = null;
    };
};

// ─── Handle remote playback (resume on this device) ──────────
export const handleRemotePlaybackChange = async (state: NowPlayingState): Promise<{
    shouldResume: boolean;
    trackId: string | null;
    positionMs: number;
}> => {
    // If the remote device stopped playing, we can optionally resume here
    // For now, just return the state for the UI to decide
    return {
        shouldResume: false,
        trackId: state.trackId,
        positionMs: state.positionMs,
    };
};
