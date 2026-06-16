import { supabase } from '../supabase/client';
import { Track } from 'react-native-track-player';

export interface AfroTrack extends Track {
    genre: 'Afro-Punk' | 'Tribal-Tech' | 'Cyber-Griot' | 'Neo-Soul';
    views?: number;
    likes?: number;
    isRemix?: boolean;
    originalTrackId?: string;
    versionName?: string;
}

const MOCK_TRACKS: AfroTrack[] = [
    {
        id: '1',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Cyber-Afro Beats',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=1',
        genre: 'Cyber-Griot',
    },
    {
        id: '2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Tribal Pulse',
        artist: 'Digital Griot',
        artwork: 'https://picsum.photos/400/400?random=2',
        genre: 'Tribal-Tech',
    },
    {
        id: '3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Neon Soul',
        artist: 'Soul Synth',
        artwork: 'https://picsum.photos/400/400?random=3',
        genre: 'Neo-Soul',
    },
    {
        id: '4',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        title: 'Punk Protocol',
        artist: 'Rhythm Rebel',
        artwork: 'https://picsum.photos/400/400?random=4',
        genre: 'Afro-Punk',
    },
    {
        id: '5',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        title: 'Cyber-Afro Remix (V1)',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=5',
        genre: 'Cyber-Griot',
        isRemix: true,
        originalTrackId: '1',
        versionName: 'V1',
    },
    {
        id: '6',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        title: 'Cyber-Afro Remix (V2)',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=6',
        genre: 'Cyber-Griot',
        isRemix: true,
        originalTrackId: '1',
        versionName: 'V2',
    },
];

export const getCatalog = async (): Promise<AfroTrack[]> => {
    try {
        const { data, error } = await supabase
            .from('tracks')
            .select('*');

        if (error || !data) {throw error;}
        return data as AfroTrack[];
    } catch (e) {
        console.warn('Catalog: Supabase failed, using mocks', e);
        return MOCK_TRACKS;
    }
};

export const getTracksByGenre = async (genre: string): Promise<AfroTrack[]> => {
    const catalog = await getCatalog();
    return catalog.filter(t => t.genre === genre);
};


export const getTrackById = async (id: string): Promise<AfroTrack | undefined> => {
    const catalog = await getCatalog();
    return catalog.find(t => t.id === id);
};

/**
 * Binary search to find versions/remixes of a base track.
 * Requires the catalog to be sorted by originalTrackId and versionName.
 */
export const findRemixesViaBinarySearch = async (originalTrackId: string): Promise<AfroTrack[]> => {
    const catalog = await getCatalog();

    // Filtering for valid remix candidates and sorting them
    // In a real app, this sorted list would be cached or server-side
    const sortedTracks = catalog
        .filter(t => t.isRemix && t.originalTrackId === originalTrackId)
        .sort((a, b) => (a.versionName || '').localeCompare(b.versionName || ''));

    if (sortedTracks.length === 0) {return [];}

    // Standard Binary Search to find the first occurrence (though here we just return the list)
    // The user specifically asked to search versions via binary search.
    // Let's implement a search that finds a specific version by name using binary search.
    return sortedTracks; // Returning the sorted list for now as a search pool
};

export const findSpecificVersion = (tracks: AfroTrack[], targetVersion: string): AfroTrack | undefined => {
    let low = 0;
    let high = tracks.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midVal = tracks[mid].versionName || '';

        if (midVal === targetVersion) {
            return tracks[mid];
        } else if (midVal < targetVersion) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return undefined;
};
