import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import TrackPlayer, { State } from 'react-native-track-player';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayerStore } from '../../stores/usePlayerStore';

interface AmbientContextValue {
    isAmbientPlaying: boolean;
    toggleAmbient: () => Promise<void>;
    setAmbientEnabled: (val: boolean) => Promise<void>;
}

export const AmbientContext = createContext<AmbientContextValue>({
    isAmbientPlaying: false,
    toggleAmbient: async () => {},
    setAmbientEnabled: async () => {},
});

const AMBIENT_STORAGE_KEY = 'spotifun-afropunk_ambient_enabled';
const AMBIENT_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3';
const AMBIENT_VOLUME = 0.15;
const AMBIENT_TRACK_ID = '__spotifun_ambient__';

export const AmbientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
    const appState = useRef<AppStateStatus>('active');
    const ambientEnabledRef = useRef(false);
    const isPlayingMainTrack = usePlayerStore(s => s.isPlaying);
    const mainTrack = usePlayerStore(s => s.currentTrack);
    const trackPlayerReady = usePlayerStore(s => s.trackPlayerReady);

    const stopAmbient = useCallback(async () => {
        try {
            const activeTrack = await TrackPlayer.getActiveTrack();
            if (activeTrack?.id === AMBIENT_TRACK_ID) {
                await TrackPlayer.reset();
                await TrackPlayer.setVolume(1);
            }
            setIsAmbientPlaying(false);
        } catch (e) {
            console.warn('[Ambient] stop error:', e);
            setIsAmbientPlaying(false);
        }
    }, []);

    const startAmbient = useCallback(async () => {
        try {
            if (!trackPlayerReady || mainTrack || isPlayingMainTrack || appState.current !== 'active') {
                return;
            }

            const state = await TrackPlayer.getState();
            if (state === State.Playing || state === State.Buffering) {
                return;
            }

            await TrackPlayer.reset();
            await TrackPlayer.setVolume(AMBIENT_VOLUME);
            await TrackPlayer.add({
                id: AMBIENT_TRACK_ID,
                url: AMBIENT_URL,
                title: 'Soft Ambient',
                artist: 'Spotifun Afropunk',
            });
            await TrackPlayer.play();
            setIsAmbientPlaying(true);
        } catch (e) {
            console.warn('[Ambient] start error:', e);
            setIsAmbientPlaying(false);
        }
    }, [isPlayingMainTrack, mainTrack, trackPlayerReady]);

    const toggleAmbient = async () => {
        if (isAmbientPlaying) {
            await stopAmbient();
            ambientEnabledRef.current = false;
            await AsyncStorage.setItem(AMBIENT_STORAGE_KEY, 'false');
        } else {
            ambientEnabledRef.current = true;
            await AsyncStorage.setItem(AMBIENT_STORAGE_KEY, 'true');
            await startAmbient();
        }
    };

    const setAmbientEnabled = async (val: boolean) => {
        ambientEnabledRef.current = val;
        try {
            await AsyncStorage.setItem(AMBIENT_STORAGE_KEY, String(val));
        } catch { /* ignore */ }
        if (val) {
            await startAmbient();
        } else {
            await stopAmbient();
        }
    };

    useEffect(() => {
        const loadAmbientPreference = async () => {
            try {
                const raw = await AsyncStorage.getItem(AMBIENT_STORAGE_KEY);
                ambientEnabledRef.current = raw === 'true';
                if (ambientEnabledRef.current) {
                    await startAmbient();
                }
            } catch { /* ignore */ }
        };
        loadAmbientPreference();
    }, [startAmbient]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextState) => {
            appState.current = nextState;
            if (nextState !== 'active') {
                await stopAmbient();
            } else if (ambientEnabledRef.current) {
                await startAmbient();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [startAmbient, stopAmbient]);

    useEffect(() => {
        if ((mainTrack || isPlayingMainTrack) && isAmbientPlaying) {
            stopAmbient();
        } else if (!mainTrack && !isPlayingMainTrack && ambientEnabledRef.current && !isAmbientPlaying) {
            startAmbient();
        }
    }, [isAmbientPlaying, isPlayingMainTrack, mainTrack, startAmbient, stopAmbient]);

    return (
        <AmbientContext.Provider value={{ isAmbientPlaying, toggleAmbient, setAmbientEnabled }}>
            {children}
        </AmbientContext.Provider>
    );
};

export const useAmbient = () => useContext(AmbientContext);
