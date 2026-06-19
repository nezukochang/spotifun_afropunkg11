-- ═══════════════════════════════════════════════════════════════════════════
-- FLUXION / AfroPunk - Supabase Schema Migration 001
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Enable extensions ─────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for full-text search

-- ─── Helper: auto-updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: profiles
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username    TEXT UNIQUE NOT NULL,
    avatar_url  TEXT,
    bio         TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: tracks
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.tracks (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title             TEXT NOT NULL,
    artist            TEXT NOT NULL,
    genre             TEXT NOT NULL DEFAULT 'afrobeats',
    artwork_url       TEXT,
    stream_url        TEXT NOT NULL,
    duration_sec      INTEGER DEFAULT 0,
    views             INTEGER DEFAULT 0,
    likes             INTEGER DEFAULT 0,
    is_remix          BOOLEAN DEFAULT FALSE,
    original_track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
    version_name      TEXT,
    album_id          UUID,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tracks_genre ON public.tracks(genre);
CREATE INDEX idx_tracks_artist ON public.tracks(artist);
CREATE INDEX idx_tracks_views ON public.tracks(views DESC);
CREATE INDEX idx_tracks_title_trgm ON public.tracks USING gin (title gin_trgm_ops);
CREATE INDEX idx_tracks_artist_trgm ON public.tracks USING gin (artist gin_trgm_ops);
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: playlists
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.playlists (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cover_url   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_playlists_user ON public.playlists(user_id);
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: playlist_tracks
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id    UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    position    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (playlist_id, track_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: favorites
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id    UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: play_history
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.play_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id    UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    played_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_history_user ON public.play_history(user_id, played_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: comments
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.comments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id    UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_track ON public.comments(track_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: friends
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.friends (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id)
);
CREATE INDEX idx_friends_user ON public.friends(user_id);
CREATE INDEX idx_friends_friend ON public.friends(friend_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

-- Profiles: public read, owner write
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tracks: public read
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks_select" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "tracks_insert" ON public.tracks FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "tracks_update" ON public.tracks FOR UPDATE USING (auth.role() = 'service_role');

-- Playlists: owner only
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "playlists_select" ON public.playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "playlists_insert" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_update" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "playlists_delete" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist tracks: inherit from playlist owner
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pt_select" ON public.playlist_tracks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "pt_insert" ON public.playlist_tracks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "pt_delete" ON public.playlist_tracks FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);

-- Favorites: owner only
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_select" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Play history: owner only
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history_select" ON public.play_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON public.play_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments: public read, auth write
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Friends: mutual read, owner write
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friends_select" ON public.friends FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = friend_id
);
CREATE POLICY "friends_insert" ON public.friends FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "friends_delete" ON public.friends FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════════════

-- Audio files bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', false)
ON CONFLICT (id) DO NOTHING;

-- Cover art bucket (if not already created)
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Sample tracks
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.tracks (title, artist, genre, artwork_url, stream_url, duration_sec, views, likes)
VALUES
    ('Afro Rhythm', 'DJ Pulse', 'afrobeats', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 372, 12480, 342),
    ('Midnight Groove', 'Amara Diallo', 'afrobeats', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 245, 8920, 218),
    ('Lagos Nights', 'Kwame Beats', 'afrobeats', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 198, 15600, 512),
    ('Sahel Wind', 'Fatou Mbaye', 'afro-jazz', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 310, 6450, 189),
    ('Djembe Thunder', 'Moussa Keita', 'afro-jazz', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 267, 9870, 301),
    ('Electric Kora', 'Sona Diabate', 'afro-jazz', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 289, 4320, 156),
    ('Bassline Rebellion', 'Nia Flux', 'afro-punk', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 223, 21300, 876),
    ('Punk Ancestors', 'Zara Riot', 'afro-punk', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 195, 18200, 743),
    ('Dread & Bass', 'Kofi Dread', 'afro-punk', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 241, 13450, 567),
    ('Spirit Frequency', 'Aya Resonance', 'electronic', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 334, 7890, 234),
    ('Quantum Griot', 'DJ Ancestor', 'electronic', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 278, 11200, 412),
    ('Neon Masquerade', 'Luna Adjei', 'electronic', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 256, 5670, 178)
ON CONFLICT DO NOTHING;
