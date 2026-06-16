import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { State, Track, Event } from 'react-native-track-player';

interface PlayerState {
    currentTrack: Track | null;
    playbackState: State;
    queue: Track[];
    isPlaying: boolean;

    setPlaybackState: (state: State) => void;
    setCurrentTrack: (track: Track | null) => void;
    setQueue: (queue: Track[]) => void;

    playTrack: (track: Track) => Promise<void>;
    togglePlay: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            playbackState: State.None,
            queue: [],
            isPlaying: false,

            setPlaybackState: (state) => set({
                playbackState: state,
                isPlaying: state === State.Playing,
            }),

            setCurrentTrack: (track) => set({ currentTrack: track }),

            setQueue: (queue) => set({ queue }),

            playTrack: async (track) => {
                await TrackPlayer.reset();
                await TrackPlayer.add(track);
                await TrackPlayer.play();
                set({ currentTrack: track, isPlaying: true });
            },

            togglePlay: async () => {
                const { isPlaying } = get();
                if (isPlaying) {
                    await TrackPlayer.pause();
                } else {
                    await TrackPlayer.play();
                }
            },
        }),
        {
            name: 'afropunk-player-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Initialize listeners
TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    usePlayerStore.getState().setPlaybackState(event.state);
});

TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    usePlayerStore.getState().setCurrentTrack(event.track || null);
});
