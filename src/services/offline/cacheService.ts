const DEFAULT_CACHE_LIMIT = 512 * 1024 * 1024; // 512 Mo

export interface CacheMetadata {
    trackId: string;
    size: number;
    lastUsed: number;
}

let mockCache: CacheMetadata[] = [];

export const getCacheSize = () => {
    return mockCache.reduce((acc, item) => acc + item.size, 0);
};

export const canDownload = (size: number) => {
    const currentSize = getCacheSize();
    return currentSize + size <= DEFAULT_CACHE_LIMIT;
};

export const downloadTrack = async (trackId: string, size: number) => {
    if (!canDownload(size)) {
        // Logic to purge old tracks if quota exceeded
        // For now, just a simple check
        throw new Error('Cache quota exceeded');
    }

    mockCache.push({
        trackId,
        size,
        lastUsed: Date.now(),
    });

    return true;
};

export const deleteTrack = (trackId: string) => {
    mockCache = mockCache.filter(t => t.trackId !== trackId);
};
