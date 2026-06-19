import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheEntry, CacheStatus, OfflineMutation, OfflineMutationType } from '../../types';
import { OFFLINE_CACHE_MAX_BYTES, CACHE_SEGMENT_TTL_MS } from '../../config';

// ─── Cache storage ──────────────────────────────────────────
const CACHE_INDEX_KEY = 'spotifun-afropunk-cache-index';
const MUTATION_QUEUE_KEY = 'spotifun-afropunk-offline-mutations';

let cacheEntries: CacheEntry[] = [];
let mutationQueue: OfflineMutation[] = [];
let initialized = false;

async function ensureLoaded(): Promise<void> {
    if (initialized) { return; }
    try {
        const rawCache = await AsyncStorage.getItem(CACHE_INDEX_KEY);
        const rawQueue = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
        cacheEntries = rawCache ? JSON.parse(rawCache) : [];
        mutationQueue = rawQueue ? JSON.parse(rawQueue) : [];
        initialized = true;
    } catch {
        cacheEntries = [];
        mutationQueue = [];
        initialized = true;
    }
}

async function persistCache(): Promise<void> {
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(cacheEntries));
}

async function persistQueue(): Promise<void> {
    await AsyncStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(mutationQueue));
}

// ─── Cache operations ────────────────────────────────────────
export const getCacheSize = async (): Promise<number> => {
    await ensureLoaded();
    return cacheEntries.reduce((acc, item) => acc + item.size, 0);
};

export const getCacheStatus = async (): Promise<CacheStatus> => {
    await ensureLoaded();
    const totalSize = cacheEntries.reduce((acc, item) => acc + item.size, 0);
    return {
        totalSize,
        maxSize: OFFLINE_CACHE_MAX_BYTES,
        entryCount: cacheEntries.length,
        entries: [...cacheEntries],
    };
};

export const canCacheTrack = async (size: number): Promise<boolean> => {
    const currentSize = await getCacheSize();
    return currentSize + size <= OFFLINE_CACHE_MAX_BYTES;
};

export const cacheTrack = async (trackId: string, size: number, streamUrl?: string): Promise<boolean> => {
    await ensureLoaded();

    if (!(await canCacheTrack(size))) {
        // Purge oldest entries to make room
        await purgeOldest(size);
        if (!(await canCacheTrack(size))) {
            return false;
        }
    }

    // Remove existing entry if any
    cacheEntries = cacheEntries.filter(e => e.trackId !== trackId);

    cacheEntries.push({
        trackId,
        size,
        lastUsed: Date.now(),
        expiresAt: Date.now() + CACHE_SEGMENT_TTL_MS,
        isEncrypted: true,
        streamUrl,
    });

    await persistCache();
    return true;
};

export const getCachedTrack = async (trackId: string): Promise<CacheEntry | undefined> => {
    await ensureLoaded();
    const entry = cacheEntries.find(e => e.trackId === trackId);
    if (entry) {
        // Check expiration
        if (entry.expiresAt < Date.now()) {
            await deleteCachedTrack(trackId);
            return undefined;
        }
        // Update last used
        entry.lastUsed = Date.now();
        await persistCache();
    }
    return entry;
};

export const deleteCachedTrack = async (trackId: string): Promise<void> => {
    await ensureLoaded();
    cacheEntries = cacheEntries.filter(e => e.trackId !== trackId);
    await persistCache();
};

export const clearCache = async (): Promise<void> => {
    await ensureLoaded();
    cacheEntries = [];
    await persistCache();
};

async function purgeOldest(requiredSpace: number): Promise<void> {
    await ensureLoaded();
    // Sort by lastUsed (oldest first)
    cacheEntries.sort((a, b) => a.lastUsed - b.lastUsed);
    let freed = 0;
    while (freed < requiredSpace && cacheEntries.length > 0) {
        const removed = cacheEntries.shift()!;
        freed += removed.size;
    }
    await persistCache();
}

export const removeExpiredEntries = async (): Promise<number> => {
    await ensureLoaded();
    const now = Date.now();
    const before = cacheEntries.length;
    cacheEntries = cacheEntries.filter(e => e.expiresAt > now);
    await persistCache();
    return before - cacheEntries.length;
};

// ─── Offline mutation queue ──────────────────────────────────
export const enqueueMutation = async (type: OfflineMutationType, payload: Record<string, unknown>): Promise<void> => {
    await ensureLoaded();
    mutationQueue.push({
        id: `mut-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        payload,
        createdAt: Date.now(),
        retryCount: 0,
    });
    await persistQueue();
};

export const getMutationQueue = async (): Promise<OfflineMutation[]> => {
    await ensureLoaded();
    return [...mutationQueue];
};

export const removeMutation = async (id: string): Promise<void> => {
    await ensureLoaded();
    mutationQueue = mutationQueue.filter(m => m.id !== id);
    await persistQueue();
};

export const clearMutationQueue = async (): Promise<void> => {
    await ensureLoaded();
    mutationQueue = [];
    await persistQueue();
};

export const incrementMutationRetry = async (id: string): Promise<void> => {
    await ensureLoaded();
    const mut = mutationQueue.find(m => m.id === id);
    if (mut) {
        mut.retryCount++;
        await persistQueue();
    }
};
