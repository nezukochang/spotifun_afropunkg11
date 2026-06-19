// ─── Supabase ────────────────────────────────────────────────
const env = typeof process !== 'undefined' ? process.env : undefined;

export const SUPABASE_URL =
    env?.SUPABASE_URL || 'https://cmusorramnhcwqblxtyu.supabase.co';

export const SUPABASE_ANON_KEY =
    env?.SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtdXNvcnJhbW5oY3dxYmx4dHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzM1NjUsImV4cCI6MjA5NzE0OTU2NX0.aX1SglP6A_ssCmVxVmZzgneHVzjB2cH-URXTcIWPyp8';

export const SUPABASE_STORAGE_BUCKET =
    env?.SUPABASE_STORAGE_BUCKET || 'covers';

// ─── Streaming ───────────────────────────────────────────────
export const STREAM_SIGNING_ENDPOINT =
    env?.STREAM_SIGNING_ENDPOINT || `${SUPABASE_URL}/functions/v1/sign-stream-url`;

// ─── Offline Cache ───────────────────────────────────────────
export const OFFLINE_CACHE_MAX_BYTES =
    Number(env?.OFFLINE_CACHE_MAX_BYTES) || 2 * 1024 * 1024 * 1024; // 2 Go

export const CACHE_SEGMENT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Bluetooth ───────────────────────────────────────────────
export const BLE_HANDOFF_SERVICE_UUID = 'F00D';
export const BLE_HANDOFF_CHAR_UUID = 'BEEF';
export const BLE_DEVICE_NAME_PREFIX = 'SpotifunAfropunk';

// ─── App ─────────────────────────────────────────────────────
export const APP_NAME = 'Spotifun Afropunk';
export const APP_VERSION = '0.1.0';

export const AUDIO_QUALITY_BITRATE: Record<string, number> = {
    low: 64,
    normal: 128,
    high: 320,
};

export const RECENT_SEARCHES_KEY = 'spotifun-afropunk-recent-searches';
export const MAX_RECENT_SEARCHES = 20;
export const SETTINGS_STORAGE_KEY = 'spotifun-afropunk-settings';
