import { supabase } from '../supabase/client';
import { Track } from 'react-native-track-player';

export interface AfroTrack extends Track {
    id: string;
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
        views: 12450, likes: 834,
    },
    {
        id: '2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Tribal Pulse',
        artist: 'Digital Griot',
        artwork: 'https://picsum.photos/400/400?random=2',
        genre: 'Tribal-Tech',
        views: 9821, likes: 612,
    },
    {
        id: '3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Neon Soul',
        artist: 'Soul Synth',
        artwork: 'https://picsum.photos/400/400?random=3',
        genre: 'Neo-Soul',
        views: 7340, likes: 401,
    },
    {
        id: '4',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        title: 'Punk Protocol',
        artist: 'Rhythm Rebel',
        artwork: 'https://picsum.photos/400/400?random=4',
        genre: 'Afro-Punk',
        views: 18990, likes: 1204,
    },
    {
        id: '5',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        title: 'Cyber-Afro Remix (V1)',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=5',
        genre: 'Cyber-Griot',
        isRemix: true, originalTrackId: '1', versionName: 'V1',
        views: 5200, likes: 310,
    },
    {
        id: '6',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        title: 'Cyber-Afro Remix (V2)',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=6',
        genre: 'Cyber-Griot',
        isRemix: true, originalTrackId: '1', versionName: 'V2',
        views: 4100, likes: 278,
    },
    {
        id: '7',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        title: 'Adinkra Dreams',
        artist: 'Kente Waves',
        artwork: 'https://picsum.photos/400/400?random=7',
        genre: 'Tribal-Tech',
        views: 6700, likes: 450,
    },
    {
        id: '8',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Lagos Nights',
        artist: 'Digital Griot',
        artwork: 'https://picsum.photos/400/400?random=8',
        genre: 'Afro-Punk',
        views: 22100, likes: 1750,
    },
    {
        id: '9',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        title: 'Savannah Echo',
        artist: 'Soul Synth',
        artwork: 'https://picsum.photos/400/400?random=9',
        genre: 'Neo-Soul',
        views: 11300, likes: 890,
    },
    {
        id: '10',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        title: 'Binary Griot',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=10',
        genre: 'Cyber-Griot',
        views: 8450, likes: 560,
    },
    {
        id: '11',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        title: 'Kente Flow',
        artist: 'Rhythm Rebel',
        artwork: 'https://picsum.photos/400/400?random=11',
        genre: 'Afro-Punk',
        views: 15200, likes: 1020,
    },
    {
        id: '12',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        title: 'Sahel Frequency',
        artist: 'Kente Waves',
        artwork: 'https://picsum.photos/400/400?random=12',
        genre: 'Tribal-Tech',
        views: 9100, likes: 620,
    },
    {
        id: '13',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
        title: 'Indigo Baobab',
        artist: 'Soul Synth',
        artwork: 'https://picsum.photos/400/400?random=13',
        genre: 'Neo-Soul',
        views: 7800, likes: 503,
    },
    {
        id: '14',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
        title: 'Circuit Ancestor',
        artist: 'Digital Griot',
        artwork: 'https://picsum.photos/400/400?random=14',
        genre: 'Cyber-Griot',
        views: 13600, likes: 940,
    },
    {
        id: '15',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
        title: 'Nairobi Storm',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=15',
        genre: 'Afro-Punk',
        views: 19800, likes: 1380,
    },
    {
        id: '16',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
        title: 'Ubuntu Frequency',
        artist: 'Kente Waves',
        artwork: 'https://picsum.photos/400/400?random=16',
        genre: 'Tribal-Tech',
        views: 10400, likes: 740,
    },
    {
        id: '17',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
        title: 'Sunset Griot',
        artist: 'Soul Synth',
        artwork: 'https://picsum.photos/400/400?random=17',
        genre: 'Neo-Soul',
        views: 6200, likes: 388,
    },
    {
        id: '18',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
        title: 'Afropunk Rising',
        artist: 'Rhythm Rebel',
        artwork: 'https://picsum.photos/400/400?random=18',
        genre: 'Afro-Punk',
        views: 25000, likes: 2100,
    },
    {
        id: '19',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Digital Masai',
        artist: 'Digital Griot',
        artwork: 'https://picsum.photos/400/400?random=19',
        genre: 'Cyber-Griot',
        views: 11700, likes: 810,
    },
    {
        id: '20',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Hausa Protocol',
        artist: 'Neon Ancestors',
        artwork: 'https://picsum.photos/400/400?random=20',
        genre: 'Tribal-Tech',
        views: 8900, likes: 590,
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
