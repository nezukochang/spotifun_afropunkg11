import { AfroTrack } from '../../services/catalog/catalogService';

/**
 * Uses Binary Search to find all remixes/versions of a given parent track ID.
 * Assumes the track list is sorted by parent_track_id.
 */
export const findRemixesBinarySearch = (tracks: AfroTrack[], parentId: string): AfroTrack[] => {
    let low = 0;
    let high = tracks.length - 1;
    let firstIndex = -1;

    // Find the first occurrence of parentId using binary search
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const midParentId = (tracks[mid] as any).parent_track_id || '';

        if (midParentId === parentId) {
            firstIndex = mid;
            high = mid - 1; // Look left for even earlier occurrences
        } else if (midParentId < parentId) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (firstIndex === -1) {return [];}

    // Collect all matches starting from firstIndex
    const results: AfroTrack[] = [];
    for (let i = firstIndex; i < tracks.length; i++) {
        if (((tracks[i] as any).parent_track_id || '') === parentId) {
            results.push(tracks[i]);
        } else {
            break;
        }
    }

    return results;
};

/**
 * Sorts tracks by parent_track_id to prepare them for binary search.
 */
export const sortTracksForSearch = (tracks: AfroTrack[]): AfroTrack[] => {
    return [...tracks].sort((a, b) => {
        const idA = (a as any).parent_track_id || '';
        const idB = (b as any).parent_track_id || '';
        return idA.localeCompare(idB);
    });
};
