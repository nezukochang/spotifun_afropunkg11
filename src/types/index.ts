import { Track } from 'react-native-track-player';

// ─── Repeat Mode ─────────────────────────────────────────────
export type RepeatMode = 'off' | 'all' | 'one';

// ─── Audio Quality ───────────────────────────────────────────
export type AudioQuality = 'low' | 'normal' | 'high';

// ─── Genre ───────────────────────────────────────────────────
export type Genre = 'Afro-Punk' | 'Tribal-Tech' | 'Cyber-Griot' | 'Neo-Soul';

// ─── Track ───────────────────────────────────────────────────
export interface AfropunkTrack extends Track {
    id: string;
    genre: Genre;
    views?: number;
    likes?: number;
    isRemix?: boolean;
    originalTrackId?: string;
    versionName?: string;
    albumId?: string;
    durationSec?: number;
}

/** @deprecated Use AfropunkTrack instead */
export type FluxionTrack = AfropunkTrack;

// ─── Album ───────────────────────────────────────────────────
export interface Album {
    id: string;
    title: string;
    artistId: string;
    artistName: string;
    coverUrl: string;
    releaseDate: string;
    trackIds: string[];
}

// ─── Artist / Profile ────────────────────────────────────────
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    isArtist: boolean;
}

export interface Artist {
    id: string;
    name: string;
    avatarUrl?: string;
    genres: Genre[];
    followerCount: number;
}

// ─── Playlist ────────────────────────────────────────────────
export interface Playlist {
    id: string;
    name: string;
    userId: string;
    description?: string;
    coverUrl?: string;
    isPublic: boolean;
    trackIds: string[];
    createdAt: string;
    updatedAt: string;
}

// ─── Comment ─────────────────────────────────────────────────
export interface Comment {
    id: string;
    trackId: string;
    userId: string;
    content: string;
    createdAt: string;
    profiles?: {
        username: string;
        avatarUrl?: string;
    };
}

// ─── Friend ──────────────────────────────────────────────────
export interface Friend {
    id: string;
    userId: string;
    friendId: string;
    status: 'pending' | 'accepted' | 'blocked';
    friend?: {
        username: string;
        avatarUrl?: string;
    };
}

// ─── Cache / Offline ─────────────────────────────────────────
export interface CacheEntry {
    trackId: string;
    size: number;
    lastUsed: number;
    expiresAt: number;
    isEncrypted: boolean;
    streamUrl?: string;
}

export interface CacheStatus {
    totalSize: number;
    maxSize: number;
    entryCount: number;
    entries: CacheEntry[];
}

// ─── Offline Mutation Queue ──────────────────────────────────
export type OfflineMutationType =
    | 'toggleFavorite'
    | 'createPlaylist'
    | 'addTrackToPlaylist'
    | 'removeTrackFromPlaylist'
    | 'incrementView'
    | 'addComment';

export interface OfflineMutation {
    id: string;
    type: OfflineMutationType;
    payload: Record<string, unknown>;
    createdAt: number;
    retryCount: number;
}

// ─── Bluetooth Handoff ───────────────────────────────────────
export interface HandoffPayload {
    sessionToken: string;
    trackId: string;
    positionMs: number;
    timestamp: number;
    senderDeviceId: string;
}

export type HandoffStatus = 'idle' | 'scanning' | 'connecting' | 'sending' | 'success' | 'error';

// ─── Search ──────────────────────────────────────────────────
export interface SearchResults {
    tracks: AfropunkTrack[];
    artists: Artist[];
    albums: Album[];
}

export interface RecentSearch {
    query: string;
    timestamp: number;
}

// ─── Realtime / Multi-Device ─────────────────────────────────
export interface NowPlayingState {
    trackId: string | null;
    positionMs: number;
    isPlaying: boolean;
    deviceId: string;
    timestamp: number;
}

// ─── Settings ────────────────────────────────────────────────
export interface AppSettings {
    audioQuality: AudioQuality;
    maxCacheBytes: number;
    reduceAnimations: boolean;
    offlineMode: boolean;
    ambientEnabled: boolean;
}

// ─── Navigation ──────────────────────────────────────────────
export type BottomTabParamList = {
    Home: undefined;
    Search: undefined;
    Library: undefined;
    Player: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Main: undefined;
    PlaylistDetail: { playlistId: string };
    Queue: undefined;
};
