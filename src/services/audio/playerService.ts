import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    Event,
    Track,
} from 'react-native-track-player';

export const SetupService = async (): Promise<boolean> => {
    let isSetup = false;
    try {
        await TrackPlayer.getCurrentTrack();
        isSetup = true;
    } catch {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            android: {
                appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo,
            ],
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
            ],
        });
        isSetup = true;
    }
    return isSetup;
};

export const PlaybackService = async () => {
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
};

// ─── Queue helpers ───────────────────────────────────────────

export const loadAndPlayQueue = async (tracks: Track[], startIndex: number = 0) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    await TrackPlayer.skip(startIndex);
    await TrackPlayer.play();
};

export const addTracksToQueue = async (tracks: Track[]) => {
    await TrackPlayer.add(tracks);
};

export const getQueuePosition = async () => {
    const index = await TrackPlayer.getActiveTrackIndex();
    return index ?? 0;
};

export const getProgress = async () => {
    const progress = await TrackPlayer.getProgress();
    return progress; // { position, duration, buffered }
};
