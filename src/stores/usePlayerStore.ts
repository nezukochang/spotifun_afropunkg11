import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { State, Track, Event } from 'react-native-track-player';
import { RepeatMode } from '../types';

interface PlayerState {
    currentTrack: Track | null;
    playbackState: State;
    queue: Track[];
    originalQueue: Track[];
    queueIndex: number;
    isPlaying: boolean;
    shuffleMode: boolean;
    repeatMode: RepeatMode;
    position: number;
    duration: number;
    trackPlayerReady: boolean;

    setPlaybackState: (state: State) => void;
    setCurrentTrack: (track: Track | null) => void;
    updateProgress: (position: number, duration: number) => void;
    setTrackPlayerReady: (ready: boolean) => void;

    playTrack: (track: Track, queueTracks?: Track[], startIndex?: number) => Promise<void>;
    togglePlay: () => Promise<void>;
    skipNext: () => Promise<void>;
    skipPrevious: () => Promise<void>;
    seekTo: (positionSec: number) => Promise<void>;
    toggleShuffle: () => void;
    cycleRepeat: () => void;

    setQueue: (queue: Track[]) => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (index: number) => void;
    reorderQueue: (from: number, to: number) => void;
    playFromQueue: (index: number) => Promise<void>;
}

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            playbackState: State.None,
            queue: [],
            originalQueue: [],
            queueIndex: -1,
            isPlaying: false,
            shuffleMode: false,
            repeatMode: 'off' as RepeatMode,
            position: 0,
            duration: 0,
            trackPlayerReady: false,

            setPlaybackState: (state) => set({
                playbackState: state,
                isPlaying: state === State.Playing,
            }),

            setCurrentTrack: (track) => set({ currentTrack: track }),
            updateProgress: (position, duration) => set({ position, duration }),
            setTrackPlayerReady: (ready) => set({ trackPlayerReady: ready }),

            playTrack: async (track, queueTracks, startIndex) => {
                try {
                    const state = get();
                    let finalQueue: Track[];

                    if (queueTracks && queueTracks.length > 0) {
                        finalQueue = state.shuffleMode ? shuffleArray(queueTracks) : [...queueTracks];
                    } else {
                        finalQueue = [track];
                    }

                    const idx = startIndex ?? finalQueue.findIndex(t => t.id === track.id);
                    const safeIdx = idx >= 0 ? idx : 0;

                    await TrackPlayer.reset();
                    await TrackPlayer.add(finalQueue);
                    await TrackPlayer.skip(safeIdx);
                    await TrackPlayer.play();

                    set({
                        currentTrack: track,
                        queue: finalQueue,
                        originalQueue: queueTracks ? [...queueTracks] : [track],
                        queueIndex: safeIdx,
                        isPlaying: true,
                    });
                } catch (e) {
                    console.warn('[Player] playTrack error:', e);
                }
            },

            togglePlay: async () => {
                try {
                    const { isPlaying } = get();
                    if (isPlaying) {
                        await TrackPlayer.pause();
                    } else {
                        await TrackPlayer.play();
                    }
                } catch (e) { console.warn('[Player] togglePlay error:', e); }
            },

            skipNext: async () => {
                try {
                    const { queue, queueIndex, repeatMode } = get();
                    if (queue.length === 0) { return; }

                    let nextIndex = queueIndex + 1;
                    if (nextIndex >= queue.length) {
                        if (repeatMode === 'all') { nextIndex = 0; }
                        else if (repeatMode === 'one') {
                            await TrackPlayer.seekTo(0);
                            await TrackPlayer.play();
                            return;
                        } else { return; }
                    }

                    await TrackPlayer.skip(nextIndex);
                    await TrackPlayer.play();
                    set({ queueIndex: nextIndex, currentTrack: queue[nextIndex], isPlaying: true });
                } catch (e) { console.warn('[Player] skipNext error:', e); }
            },

            skipPrevious: async () => {
                try {
                    const { queue, queueIndex, position, repeatMode } = get();
                    if (queue.length === 0) { return; }

                    if (position > 3) {
                        await TrackPlayer.seekTo(0);
                        return;
                    }

                    let prevIndex = queueIndex - 1;
                    if (prevIndex < 0) {
                        if (repeatMode === 'all') { prevIndex = queue.length - 1; }
                        else { await TrackPlayer.seekTo(0); return; }
                    }

                    await TrackPlayer.skip(prevIndex);
                    await TrackPlayer.play();
                    set({ queueIndex: prevIndex, currentTrack: queue[prevIndex], isPlaying: true });
                } catch (e) { console.warn('[Player] skipPrevious error:', e); }
            },

            seekTo: async (positionSec) => {
                try {
                    await TrackPlayer.seekTo(positionSec);
                    set({ position: positionSec });
                } catch (e) { console.warn('[Player] seekTo error:', e); }
            },

            toggleShuffle: () => {
                const { shuffleMode, queue, originalQueue, currentTrack } = get();
                if (!shuffleMode) {
                    const shuffled = shuffleArray(originalQueue.length > 0 ? originalQueue : queue);
                    const idx = currentTrack ? shuffled.findIndex(t => t.id === currentTrack.id) : 0;
                    set({
                        shuffleMode: true, queue: shuffled,
                        originalQueue: originalQueue.length > 0 ? originalQueue : [...queue],
                        queueIndex: idx >= 0 ? idx : 0,
                    });
                } else {
                    const idx = currentTrack ? originalQueue.findIndex(t => t.id === currentTrack.id) : 0;
                    set({
                        shuffleMode: false, queue: [...originalQueue],
                        queueIndex: idx >= 0 ? idx : 0,
                    });
                }
            },

            cycleRepeat: () => {
                const { repeatMode } = get();
                const next: RepeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
                set({ repeatMode: next });
            },

            setQueue: (queue) => set({ queue, originalQueue: [...queue] }),

            addToQueue: (track) => {
                const { queue, originalQueue } = get();
                try { TrackPlayer.add(track); } catch {}
                set({ queue: [...queue, track], originalQueue: [...originalQueue, track] });
            },

            removeFromQueue: async (index) => {
                const { queue, originalQueue, queueIndex } = get();
                if (index === queueIndex) { return; }
                const newQueue = queue.filter((_, i) => i !== index);
                const newOriginal = originalQueue.filter((_, i) => i !== index);
                const newIndex = index < queueIndex ? queueIndex - 1 : queueIndex;
                try { await TrackPlayer.remove(index); } catch {}
                set({ queue: newQueue, originalQueue: newOriginal, queueIndex: newIndex });
            },

            reorderQueue: (from, to) => {
                const { queue, originalQueue, queueIndex } = get();
                if (from < 0 || to < 0 || from >= queue.length || to >= queue.length || from === to) { return; }
                if (queue.length !== originalQueue.length) { return; }
                const newQueue = queue.filter((_, i) => i !== from);
                newQueue.splice(to, 0, queue[from]);
                const newOriginal = originalQueue.filter((_, i) => i !== from);
                newOriginal.splice(to, 0, originalQueue[from]);
                let newIndex = queueIndex;
                if (from === queueIndex) { newIndex = to; }
                else if (from < queueIndex && to >= queueIndex) { newIndex--; }
                else if (from > queueIndex && to <= queueIndex) { newIndex++; }
                set({ queue: newQueue, originalQueue: newOriginal, queueIndex: Math.max(0, newIndex) });
            },

            playFromQueue: async (index) => {
                try {
                    const { queue } = get();
                    if (index < 0 || index >= queue.length) { return; }
                    await TrackPlayer.skip(index);
                    await TrackPlayer.play();
                    set({ queueIndex: index, currentTrack: queue[index], isPlaying: true });
                } catch (e) { console.warn('[Player] playFromQueue error:', e); }
            },
        }),
        {
            name: 'spotifun-afropunk-player-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                shuffleMode: state.shuffleMode,
                repeatMode: state.repeatMode,
                queue: state.queue,
                originalQueue: state.originalQueue,
                queueIndex: state.queueIndex,
            }),
        }
    )
);

// ─── Deferred event listener registration ────────────────────
// Only register after TrackPlayer is ready to avoid crashes in bridgeless mode
export const registerPlayerEventListeners = () => {
    try {
        TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
            usePlayerStore.getState().setPlaybackState(event.state);
        });

        TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
            usePlayerStore.getState().setCurrentTrack(event.track || null);
        });

        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
            const { repeatMode, queue } = usePlayerStore.getState();
            usePlayerStore.setState({ isPlaying: false });
            if (repeatMode === 'all' && queue.length > 0) {
                TrackPlayer.skip(0).then(() => TrackPlayer.play());
                usePlayerStore.setState({ queueIndex: 0, currentTrack: queue[0], isPlaying: true });
            } else {
                usePlayerStore.setState({ currentTrack: null });
            }
        });

        usePlayerStore.getState().setTrackPlayerReady(true);
        console.log('[Player] Event listeners registered');
    } catch (e) {
        console.warn('[Player] Failed to register event listeners:', e);
    }
};
