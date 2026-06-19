# Spotifun Afropunk - Documentation Complète

## Table des Matières

1. [Cahier des Charges](#1-cahier-des-charges)
2. [Conception Architecture](#2-conception-architecture)
3. [Modélisation](#3-modélisation)
4. [Implémentation](#4-implémentation)

---

# 1. CAHIER DES CHARGES

## 1.1 Présentation du Projet

### 1.1.1 Identité du Projet
- **Nom**: Spotifun Afropunk
- **Type**: Application mobile de streaming musical
- **Plateforme**: iOS & Android (React Native)
- **Version**: 0.0.1
- **Identité Visuelle**: Afro-centrique, inspiration terre africaine, symboles Adinkra, tissu Kente

### 1.1.2 Objectifs Principaux
1. Créer une plateforme de streaming musical centrée sur les musiques africaines (Afrobeats, Afro-jazz, Afro-punk, Électronique africaine)
2. Intégrer une expérience sociale collaborative (amis, commentaires, partage)
3. Support offline-first pour les zones à connectivité limitée
4. Transfert de playback entre devices via Bluetooth LE
5. Interface immersive avec animations et thème Afro-punk

## 1.2 Spécifications Fonctionnelles

### 1.2.1 Authentification & Onboarding
- **Inscription/Connexion** via Supabase Auth (email/password)
- **Onboarding** en 3 étapes présentant les fonctionnalités clés
- **Persistance de session** avec stockage local sécurisé
- **Profil utilisateur** avec avatar, bio, nom d'utilisateur

### 1.2.2 Lecture Musicale
- **Player audio** complet avec contrôles (play, pause, skip, seek)
- **File d'attente** (queue) avec réorganisation
- **Modes de répétition** (off, all, one)
- **Mode shuffle** pour aléatoire
- **Recherche** dans la barre de progression
- **Mini-player** persistant en bas de l'écran
- **Plein écran** player avec artwork et contrôles étendus

### 1.2.3 Catalogue Musical
- **Bibliothèque de tracks** avec metadata complète
- **Genres musicaux**: Afrobeats, Afro-jazz, Afro-punk, Électronique
- **Recherche multi-critères**: titre, artiste, genre
- **Recherche floue** (fuzzy search) avec trigrammes
- **Historique de recherche** local
- **Filtrage par genres**

### 1.2.4 Bibliothèque Utilisateur
- **Playlists personnelles** (création, modification, suppression)
- **Tracks favorites** (système de like)
- **Historique d'écoute** (play history)
- **Gestion des artistes** suivis
- **Interface de collection** avec sections (playlists, artistes, tribu)

### 1.2.5 Fonctionnalités Sociales
- **Système d'amis** (ajouter, accepter, gérer)
- **Commentaires** sur les tracks
- **Partage de musique** entre amis
- **Panel social** avec stats (vues, likes)
- **Chat** intégré
- **Tribu** (communauté musicale)

### 1.2.6 Mode Offline
- **Cache audio** pour écoute hors-ligne
- **Gestion intelligente du stockage** (max configurable)
- **File de mutations offline** (actions en attente de sync)
- **Détection de connectivité** avec bandeau réseau
- **Retry automatique** à la reconnexion

### 1.2.7 Bluetooth Handoff
- **Transfert de playback** entre devices via BLE
- **Payload de session** (track ID, position, timestamp)
- **Scan et connexion** à des devices proches
- **Synchronisation d'état** de playback

### 1.2.8 Paramètres & Personnalisation
- **Thèmes multiples** (Terracotta, Gold, Violet, Emerald)
- **Modes de luminosité** (Dark, Mid, Light)
- **Multi-langue** (English, Français, 日本語)
- **Qualité audio** (low, normal, high)
- **Gestion du cache** (visualisation, nettoyage)
- **Statut Premium** (Free vs Premium features)

### 1.2.9 Ambiance Visuelle
- **Background animé** Afro-punk avec slideshow
- **Effets glass morphism** sur les cartes
- **Animations Reanimated** (spring, timing, fade)
- **Glow effects** sur éléments interactifs
- **Slideshow culturel africain**

## 1.3 Spécifications Techniques

### 1.3.1 Stack Technologique
- **Framework**: React Native 0.76.0
- **Language**: TypeScript 5.0.4
- **Navigation**: React Navigation 7.x (Bottom Tabs + Native Stack)
- **State Management**: Zustand 4.5.2
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Audio**: react-native-track-player 4.0.1
- **Bluetooth**: react-native-ble-plx 3.1.2
- **Animations**: react-native-reanimated 3.16.1
- **Storage Local**: @react-native-async-storage 1.24.0
- **Data Fetching**: @tanstack/react-query 5.45.1
- **Réseau**: @react-native-community/netinfo 11.4.1

### 1.3.2 Contraintes Techniques
- **Node.js**: >= 18
- **iOS**: Support iOS 13+
- **Android**: API 21+ (Android 5.0)
- **Taille APK/IPA**: Optimisée (< 50MB idéalement)
- **Performance**: 60 FPS sur animations
- **Offline**: Fonctionnalités core disponibles sans réseau

### 1.3.3 Performance & Qualité
- **ESLint** avec config React Native
- **Prettier** pour formatage automatique
- **Jest** pour tests unitaires
- **TypeScript strict** pour type safety
- **Error Boundaries** pour gestion d'erreurs UI

## 1.4 Spécifications Non-Fonctionnelles

### 1.4.1 Sécurité
- **Authentification JWT** via Supabase
- **Row Level Security (RLS)** sur toutes les tables
- **Stockage sécurisé** des sessions (AsyncStorage)
- **URLs de stream** protégées (bucket privé)
- **Validation des données** côté client et serveur

### 1.4.2 Accessibilité
- **Support multi-langue** (i18n)
- **Contraste des couleurs** conforme WCAG
- **Hit slopes** sur boutons pour faciliter le touch
- **Textes adaptatifs** selon la langue

### 1.4.3 Scalabilité
- **Architecture modulaire** (features, services, stores)
- **Base de données PostgreSQL** scalable
- **CDN pour assets** (Supabase Storage)
- **Realtime subscriptions** pour sync multi-device

---

# 2. CONCEPTION ARCHITECTURE

## 2.1 Architecture Globale

```
┌─────────────────────────────────────────────────────┐
│                   Spotifun Afropunk                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │           Presentation Layer                  │  │
│  │  (Screens, UI Components, Navigation)        │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓ ↑                           │
│  ┌──────────────────────────────────────────────┐  │
│  │           Business Logic Layer                │  │
│  │  (Zustand Stores, Services, Hooks)           │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓ ↑                           │
│  ┌──────────────────────────────────────────────┐  │
│  │           Data Layer                          │  │
│  │  (Supabase, AsyncStorage, Cache, BLE)        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 2.2 Architecture en Couches

### 2.2.1 Presentation Layer
**Responsabilité**: UI/UX, navigation, interactions utilisateur

**Structure**:
```
src/
├── features/          # Écrans par fonctionnalité
│   ├── auth/         # Login, SignUp, Onboarding
│   ├── home/         # Écran d'accueil
│   ├── search/       # Recherche
│   ├── player/       # Player, Library, Settings, Queue
│   └── bluetooth/    # Handoff panel
├── shared/
│   ├── ui/           # Composants réutilisables
│   ├── theme/        # Thèmes et couleurs
│   └── i18n/         # Traductions
└── app/
    └── navigation/   # Configuration navigation
```

**Composants Clés**:
- `AppNavigator`: Navigation principale (Tabs + Stack)
- `MiniPlayer`: Player persistant en bas
- `GlassCard`: Composant glass morphism
- `AfroPunkBackground`: Background animé thématique
- `Button`, `NetworkBanner`, `ErrorBoundary`

### 2.2.2 Business Logic Layer
**Responsabilité**: State management, logique métier, orchestration

**Structure**:
```
src/
├── stores/           # Zustand stores
│   ├── useAuthStore      # État authentication
│   ├── usePlayerStore    # État player audio
│   └── useThemeStore     # État thème/préférences
├── services/         # Services métier
│   ├── audio/            # Player, Ambient
│   ├── bluetooth/        # BLE handoff
│   ├── catalog/          # Catalogue, recherche, library
│   ├── offline/          # Cache, mutations offline
│   └── supabase/         # Auth, realtime, client
└── hooks/            # Hooks custom
    └── useNetworkStatus  # Détection réseau
```

**Stores Zustand**:
1. **useAuthStore**: Session, user, onboarding status
2. **usePlayerStore**: Track en cours, queue, playback state, shuffle/repeat
3. **useThemeStore**: Thème actif, mode, locale, settings

**Services**:
1. **playerService**: Setup TrackPlayer, contrôles audio
2. **bleService**: Bluetooth LE scanning, handoff
3. **catalogService**: CRUD tracks, playlists
4. **searchService**: Recherche locale + Supabase
5. **cacheService**: Gestion cache offline
6. **authService**: Login, signup, session
7. **realtimeService**: Subscriptions Supabase

### 2.2.3 Data Layer
**Responsabilité**: Persistance, API, stockage local

**Sources de Données**:
```
┌──────────────────┬──────────────────────────────────┐
│ Source           │ Usage                            │
├──────────────────┼──────────────────────────────────┤
│ Supabase DB      │ Tracks, users, playlists,        │
│ (PostgreSQL)     │ comments, friends, history       │
├──────────────────┼──────────────────────────────────┤
│ Supabase Auth    │ Authentication, sessions         │
├──────────────────┼──────────────────────────────────┤
│ Supabase Storage │ Audio files, covers, avatars     │
├──────────────────┼──────────────────────────────────┤
│ Supabase Realtime│ Sync temps réel (playback,       │
│                  │ comments)                        │
├──────────────────┼──────────────────────────────────┤
│ AsyncStorage     │ Session, thème, settings, cache  │
│                  │ metadata, search history         │
├──────────────────┼──────────────────────────────────┤
│ TrackPlayer      │ File d'attente audio native,     │
│                  │ playback background              │
├──────────────────┼──────────────────────────────────┤
│ BLE              │ Handoff entre devices            │
└──────────────────┴──────────────────────────────────┘
```

## 2.3 Architecture de Navigation

```
App (Root)
  ↓
Auth Flow (si pas session)
  ├─ OnboardingScreen
  ├─ LoginScreen
  └─ SignUpScreen
  
AppNavigator (si authentifié)
  └─ MainTabs (Bottom Tab Navigator)
       ├─ HomeScreen
       ├─ SearchScreen
       ├─ LibraryScreen
       ├─ PlayerScreen
       └─ SettingsScreen
       
MiniPlayer (overlay sur tous les écrans sauf Player)
NetworkBanner (overlay top si offline)
```

## 2.4 Patterns Architecturaux Utilisés

### 2.4.1 Feature-Sliced Design
- Organisation par fonctionnalité (`features/auth`, `features/player`)
- Chaque feature est autonome avec ses screens et logique
- Partage de composants via `shared/`

### 2.4.2 State Management Pattern
- **Zustand** pour state global (léger, sans boilerplate)
- **Persist middleware** pour persistance AsyncStorage
- **Séparation des stores** par domaine (auth, player, theme)

### 2.4.3 Service Layer Pattern
- Services isolés pour chaque domaine (audio, BLE, catalog)
- Abstraction de la complexité Supabase/TrackPlayer
- Interfaces claires pour les stores

### 2.4.4 Offline-First Pattern
- Cache local pour données fréquemment utilisées
- File de mutations pour actions offline
- Sync automatique à la reconnexion
- Détection réseau avec UI feedback

### 2.4.5 Repository Pattern (implicite)
- Services catalog agissent comme repositories
- Abstraction de la source de données (Supabase vs cache)
- Méthodes CRUD standardisées

---

# 3. MODÉLISATION

## 3.1 Modèle de Données - Base de Données

### 3.1.1 Diagramme Entité-Relation

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │   tracks     │       │  playlists   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ username     │  │    │ title        │    │  │ name         │
│ avatar_url   │  │    │ artist       │    │  │ user_id (FK) │
│ bio          │  │    │ genre        │    │  │ cover_url    │
│ created_at   │  │    │ artwork_url  │    │  │ created_at   │
│ updated_at   │  │    │ stream_url   │    │  │ updated_at   │
└──────────────┘  │    │ duration_sec │    │  └──────────────┘
                  │    │ views        │    │           │
                  │    │ likes        │    │           │
                  │    │ is_remix     │    │           │
                  │    │ original_    │    │           │
                  │    │  track_id(FK)│    │           │
                  │    │ version_name │    │           │
                  │    │ album_id     │    │           │
                  │    │ created_at   │    │           │
                  │    │ updated_at   │    │           │
                  │    └──────────────┘    │           │
                  │           │            │           │
                  │    ┌──────┴────────┐   │    ┌──────┴──────────┐
                  │    │  favorites    │   │    │playlist_tracks  │
                  │    ├──────────────┤   │    ├─────────────────┤
                  │    │user_id (FK)  │◄──┘    │ playlist_id(FK) │
                  └───►│track_id (FK) │        │ track_id (FK)   │
                       │ created_at   │        │ position        │
                       └──────────────┘        └─────────────────┘
                       
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ play_history │       │  comments    │       │   friends    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │user_id (FK)  │
│ user_id (FK) │       │track_id (FK) │       │friend_id(FK) │
│ track_id(FK) │       │user_id (FK)  │       │ created_at   │
│ played_at    │       │ content      │       └──────────────┘
└──────────────┘       │ created_at   │
                       └──────────────┘
```

### 3.1.2 Schéma Détaillé des Tables

#### Table: profiles
```sql
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id),
    username    TEXT UNIQUE NOT NULL,
    avatar_url  TEXT,
    bio         TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```
**Rôle**: Profils utilisateurs, synchronisé avec auth.users

#### Table: tracks
```sql
CREATE TABLE tracks (
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
    original_track_id UUID REFERENCES tracks(id),
    version_name      TEXT,
    album_id          UUID,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```
**Index**: genre, artist, views DESC, title (trigram), artist (trigram)

#### Table: playlists
```sql
CREATE TABLE playlists (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    user_id     UUID NOT NULL REFERENCES auth.users(id),
    cover_url   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: playlist_tracks
```sql
CREATE TABLE playlist_tracks (
    playlist_id UUID REFERENCES playlists(id),
    track_id    UUID REFERENCES tracks(id),
    position    INTEGER DEFAULT 0,
    PRIMARY KEY (playlist_id, track_id)
);
```

#### Table: favorites
```sql
CREATE TABLE favorites (
    user_id     UUID REFERENCES auth.users(id),
    track_id    UUID REFERENCES tracks(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);
```

#### Table: play_history
```sql
CREATE TABLE play_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES auth.users(id),
    track_id    UUID REFERENCES tracks(id),
    played_at   TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: comments
```sql
CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id    UUID REFERENCES tracks(id),
    user_id     UUID REFERENCES auth.users(id),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: friends
```sql
CREATE TABLE friends (
    user_id     UUID REFERENCES auth.users(id),
    friend_id   UUID REFERENCES auth.users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id)
);
```

## 3.2 Modèle de Données - TypeScript

### 3.2.1 Types Core

```typescript
// Types d'énumération
type RepeatMode = 'off' | 'all' | 'one'
type AudioQuality = 'low' | 'normal' | 'high'
type Genre = 'Afro-Punk' | 'Tribal-Tech' | 'Cyber-Griot' | 'Neo-Soul'

// Track (extension de TrackPlayer)
interface AfropunkTrack extends Track {
    id: string
    genre: Genre
    views?: number
    likes?: number
    isRemix?: boolean
    originalTrackId?: string
    versionName?: string
    albumId?: string
    durationSec?: number
}

// Utilisateur
interface UserProfile {
    id: string
    username: string
    email: string
    avatarUrl?: string
    bio?: string
    isArtist: boolean
}

// Playlist
interface Playlist {
    id: string
    name: string
    userId: string
    description?: string
    coverUrl?: string
    isPublic: boolean
    trackIds: string[]
    createdAt: string
    updatedAt: string
}

// Commentaire
interface Comment {
    id: string
    trackId: string
    userId: string
    content: string
    createdAt: string
    profiles?: {
        username: string
        avatarUrl?: string
    }
}

// Ami
interface Friend {
    id: string
    userId: string
    friendId: string
    status: 'pending' | 'accepted' | 'blocked'
    friend?: {
        username: string
        avatarUrl?: string
    }
}
```

### 3.2.2 Types Offline & Cache

```typescript
interface CacheEntry {
    trackId: string
    size: number
    lastUsed: number
    expiresAt: number
    isEncrypted: boolean
    streamUrl?: string
}

interface CacheStatus {
    totalSize: number
    maxSize: number
    entryCount: number
    entries: CacheEntry[]
}

type OfflineMutationType = 
    | 'toggleFavorite'
    | 'createPlaylist'
    | 'addTrackToPlaylist'
    | 'removeTrackFromPlaylist'
    | 'incrementView'
    | 'addComment'

interface OfflineMutation {
    id: string
    type: OfflineMutationType
    payload: Record<string, unknown>
    createdAt: number
    retryCount: number
}
```

### 3.2.3 Types Bluetooth & Realtime

```typescript
interface HandoffPayload {
    sessionToken: string
    trackId: string
    positionMs: number
    timestamp: number
    senderDeviceId: string
}

type HandoffStatus = 
    | 'idle' 
    | 'scanning' 
    | 'connecting' 
    | 'sending' 
    | 'success' 
    | 'error'

interface NowPlayingState {
    trackId: string | null
    positionMs: number
    isPlaying: boolean
    deviceId: string
    timestamp: number
}
```

## 3.3 Modèle d'État (Zustand Stores)

### 3.3.1 useAuthStore

```typescript
interface AuthState {
    // État
    user: User | null
    session: Session | null
    isLoading: boolean
    hasSeenOnboarding: boolean
    
    // Actions
    setSession: (session: Session | null) => void
    setUser: (user: User | null) => void
    setLoading: (isLoading: boolean) => void
    signOut: () => void
    completeOnboarding: () => void
}
```

**Persistance**: AsyncStorage (`afropunk-auth-storage`)

### 3.3.2 usePlayerStore

```typescript
interface PlayerState {
    // État
    currentTrack: Track | null
    playbackState: State
    queue: Track[]
    originalQueue: Track[]
    queueIndex: number
    isPlaying: boolean
    shuffleMode: boolean
    repeatMode: RepeatMode
    position: number
    duration: number
    trackPlayerReady: boolean
    
    // Actions basiques
    setPlaybackState: (state: State) => void
    setCurrentTrack: (track: Track | null) => void
    updateProgress: (position: number, duration: number) => void
    setTrackPlayerReady: (ready: boolean) => void
    
    // Contrôles player
    playTrack: (track: Track, queueTracks?: Track[], startIndex?: number) => Promise<void>
    togglePlay: () => Promise<void>
    skipNext: () => Promise<void>
    skipPrevious: () => Promise<void>
    seekTo: (positionSec: number) => Promise<void>
    toggleShuffle: () => void
    cycleRepeat: () => void
    
    // Gestion queue
    setQueue: (queue: Track[]) => void
    addToQueue: (track: Track) => void
    removeFromQueue: (index: number) => void
    reorderQueue: (from: number, to: number) => void
    playFromQueue: (index: number) => Promise<void>
}
```

**Persistance**: AsyncStorage (`afropunk-player-storage`)

### 3.3.3 useThemeStore

```typescript
interface ThemeState {
    // État
    theme: ThemeName
    mode: 'dark' | 'mid' | 'light'
    locale: Locale
    settings: AppSettings
    
    // Actions
    setTheme: (theme: ThemeName) => void
    setMode: (mode: 'dark' | 'mid' | 'light') => void
    setLocale: (locale: Locale) => void
    updateSettings: (settings: Partial<AppSettings>) => void
    loadTheme: () => Promise<void>
    loadLocale: () => Promise<void>
}
```

**Persistance**: AsyncStorage (`afropunk-theme-storage`)

## 3.4 Modèle de Navigation

```typescript
// Param Lists pour type safety
type BottomTabParamList = {
    Home: undefined
    Search: undefined
    Library: undefined
    Player: undefined
    Settings: undefined
}

type RootStackParamList = {
    Main: undefined
    PlaylistDetail: { playlistId: string }
    Queue: undefined
}
```

## 3.5 Modèle Thème & i18n

### 3.5.1 Structure Thème

```typescript
interface ThemeColors {
    void: string              // Background principal
    surface: string           // Surface cards
    surfaceLight: string      // Surface alternative
    white: string             // Texte principal
    accent: string            // Couleur principale (Terracotta)
    accentSecondary: string   // Gold
    accentTertiary: string    // Bronze
    accentGold: string        // Gold
    accentViolet: string      // Violet
    accentEmerald: string     // Vert
    glass: string             // Glass morphism
    glassBorder: string       // Bordure glass
    glassActive: string       // Glass actif
    gray: Record<1-900>       // Nuances de gris
    error: string             // Rouge erreur
    success: string           // Vert succès
    warning: string           // Jaune warning
}

interface ThemePreset {
    name: string
    colors: ThemeColors
    icon: string
}
```

### 3.5.2 Structure i18n

```typescript
type Locale = 'en' | 'fr' | 'ja'

interface TranslationStrings {
    // Auth
    login: string
    signUp: string
    logout: string
    // ... (100+ clés de traduction)
}

const TRANSLATIONS: Record<Locale, TranslationStrings> = {
    en: { /* English */ },
    fr: { /* Français */ },
    ja: { /* 日本語 */ }
}
```

---

# 4. IMPLÉMENTATION

## 4.1 Structure du Projet

```
spotifun-afropunk/
├── android/                    # Code natif Android
├── ios/                        # Code natif iOS
├── assets/images/              # Images statiques
├── supabase/migrations/        # Migrations DB
│   └── 001_initial_schema.sql
├── src/
│   ├── app/
│   │   └── navigation/
│   │       └── AppNavigator.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── search/
│   │   │   └── SearchScreen.tsx
│   │   ├── player/
│   │   │   ├── PlayerScreen.tsx
│   │   │   ├── LibraryScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── QueueModal.tsx
│   │   └── bluetooth/
│   │       └── HandoffPanel.tsx
│   ├── services/
│   │   ├── audio/
│   │   │   ├── playerService.ts
│   │   │   └── AmbientProvider.tsx
│   │   ├── bluetooth/
│   │   │   └── bleService.ts
│   │   ├── catalog/
│   │   │   ├── catalogService.ts
│   │   │   ├── searchService.ts
│   │   │   ├── socialService.ts
│   │   │   └── userLibraryService.ts
│   │   ├── offline/
│   │   │   └── cacheService.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── authService.ts
│   │       └── realtimeService.ts
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   ├── usePlayerStore.ts
│   │   └── useThemeStore.ts
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── MiniPlayer.tsx
│   │   │   ├── AfroPunkBackground.tsx
│   │   │   ├── AfricanSlideshow.tsx
│   │   │   ├── Animations.tsx
│   │   │   ├── NetworkBanner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── SocialPanel.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── FriendsList.tsx
│   │   │   ├── ArtistManager.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── presets.ts
│   │   │   └── index.ts
│   │   ├── i18n/
│   │   │   ├── translations.ts
│   │   │   └── useI18nStore.ts
│   │   └── utils/
│   │       └── searchUtils.ts
│   ├── hooks/
│   │   └── useNetworkStatus.ts
│   ├── types/
│   │   └── index.ts
│   └── config/
│       └── index.ts
├── App.tsx                     # Entry point
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
└── metro.config.js
```

## 4.2 Implémentation des Fonctionnalités Clés

### 4.2.1 Authentification (App.tsx)

```typescript
// Flow d'initialisation
useEffect(() => {
    const setup = async () => {
        // 1. Charger thème et locale
        await Promise.all([loadTheme(), loadLocale()])
        
        // 2. Initialiser auth Supabase
        await initializeAuth()
        
        // 3. Setup TrackPlayer
        const ready = await SetupService()
        if (ready) {
            registerPlayerEventListeners()
        }
    }
    setup()
}, [])

// Flow de navigation conditionnelle
if (!hasSeenOnboarding) return <OnboardingScreen />
if (!session) return <AuthFlow />
return <AppNavigator />
```

### 4.2.2 Player Audio (usePlayerStore)

```typescript
// Play track avec queue
playTrack: async (track, queueTracks, startIndex) => {
    // 1. Déterminer la queue finale
    let finalQueue = queueTracks || [track]
    if (shuffleMode) finalQueue = shuffleArray(finalQueue)
    
    // 2. Sauvegarder queue originale
    const originalQueue = [...finalQueue]
    
    // 3. Reset TrackPlayer
    await TrackPlayer.reset()
    
    // 4. Ajouter tracks au player
    await TrackPlayer.add(finalQueue)
    
    // 5. Jouer à l'index spécifié
    await TrackPlayer.skip(startIndex || 0)
    await TrackPlayer.play()
    
    // 6. Mettre à jour le store
    set({
        currentTrack: track,
        queue: finalQueue,
        originalQueue,
        queueIndex: startIndex || 0,
        isPlaying: true
    })
}

// Skip next avec gestion repeat
skipNext: async () => {
    const { queueIndex, queue, repeatMode } = get()
    
    if (repeatMode === 'one') {
        await TrackPlayer.seekTo(0)
        await TrackPlayer.play()
        return
    }
    
    let nextIndex = queueIndex + 1
    if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
            nextIndex = 0
        } else {
            return // Fin de la queue
        }
    }
    
    await TrackPlayer.skip(nextIndex)
    set({ queueIndex: nextIndex })
}
```

### 4.2.3 Recherche Fuzzy (searchService)

```typescript
// Recherche multi-critères
export const searchTracks = async (query: string) => {
    // 1. Recherche locale dans cache
    const cachedResults = searchLocalCache(query)
    
    // 2. Recherche Supabase avec trigrammes
    const { data } = await supabase
        .from('tracks')
        .select('*')
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
        .order('views', { ascending: false })
        .limit(20)
    
    // 3. Merge et déduplication
    return mergeResults(cachedResults, data)
}

// Recherche artistes
export const searchArtists = async (query: string) => {
    const { data } = await supabase
        .from('tracks')
        .select('artist, genre')
        .ilike('artist', `%${query}%`)
    
    // Grouper par artiste unique
    const uniqueArtists = groupByArtist(data)
    return uniqueArtists
}
```

### 4.2.4 Cache Offline (cacheService)

```typescript
// Télécharger et cacher une track
export const cacheTrack = async (track: AfropunkTrack) => {
    const { data } = await fetch(track.streamUrl)
    const blob = await data.blob()
    
    // Sauvegarder dans AsyncStorage metadata
    const entry: CacheEntry = {
        trackId: track.id,
        size: blob.size,
        lastUsed: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 jours
        isEncrypted: false,
        streamUrl: track.streamUrl
    }
    
    await AsyncStorage.setItem(
        `cache_${track.id}`,
        JSON.stringify(entry)
    )
    
    // Sauvegarder blob dans filesystem
    const path = `${CACHE_DIR}/${track.id}.mp3`
    await writeFile(path, blob)
}

// Vérifier si track est cachée
export const isTrackCached = async (trackId: string) => {
    const entry = await AsyncStorage.getItem(`cache_${trackId}`)
    if (!entry) return false
    
    const cacheEntry: CacheEntry = JSON.parse(entry)
    
    // Vérifier expiration
    if (Date.now() > cacheEntry.expiresAt) {
        await removeCacheEntry(trackId)
        return false
    }
    
    // Vérifier fichier existe
    return await exists(`${CACHE_DIR}/${trackId}.mp3`)
}
```

### 4.2.5 Bluetooth Handoff (bleService)

```typescript
// Envoyer playback à un autre device
export const sendHandoff = async (payload: HandoffPayload) => {
    // 1. Scanner devices BLE
    const devices = await bleManager.startDeviceScan()
    
    // 2. Connecter au device cible
    const device = devices.find(d => d.id === payload.senderDeviceId)
    await device.connect()
    
    // 3. Découvrir services
    const service = await device.discoverService(HANDOFF_SERVICE_UUID)
    const characteristic = await service.discoverCharacteristic(
        HANDOFF_CHAR_UUID
    )
    
    // 4. Envoyer payload
    const data = encodeHandoffPayload(payload)
    await characteristic.write(data, false)
    
    // 5. Déconnecter
    await device.cancelConnection()
}

// Recevoir handoff
export const listenForHandoff = (callback: (payload: HandoffPayload) => void) => {
    // 1. Setup peripheral mode
    bleManager.enablePeripheralMode(HANDOFF_SERVICE_UUID)
    
    // 2. Listen pour écritures
    return bleManager.onCharacteristicWrite(
        HANDOFF_SERVICE_UUID,
        HANDOFF_CHAR_UUID,
        (data) => {
            const payload = decodeHandoffPayload(data)
            callback(payload)
        }
    )
}
```

### 4.2.6 Realtime Sync (realtimeService)

```typescript
// S'abonner au playback d'autres devices
export const subscribeToPlayback = (
    callback: (state: NowPlayingState) => void
) => {
    return supabase
        .channel('playback-sync')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'playback_state',
            },
            (payload) => {
                callback(payload.new as NowPlayingState)
            }
        )
        .subscribe()
}

// Publier son état de playback
export const publishPlaybackState = async (
    state: NowPlayingState
) => {
    await supabase
        .from('playback_state')
        .upsert({
            device_id: state.deviceId,
            track_id: state.trackId,
            position_ms: state.positionMs,
            is_playing: state.isPlaying,
            timestamp: state.timestamp
        })
}
```

### 4.2.7 Mutations Offline (offline queue)

```typescript
// Ajouter une mutation à la file
export const queueMutation = async (
    mutation: OfflineMutation
) => {
    // 1. Sauvegarder localement
    const queue = await getMutationQueue()
    queue.push(mutation)
    await AsyncStorage.setItem(
        'offline_mutations',
        JSON.stringify(queue)
    )
    
    // 2. Essayer de flush si online
    const isConnected = await checkNetwork()
    if (isConnected) {
        await flushMutations()
    }
}

// Exécuter toutes les mutations en file
export const flushMutations = async () => {
    const queue = await getMutationQueue()
    if (queue.length === 0) return
    
    const failed: OfflineMutation[] = []
    
    for (const mutation of queue) {
        try {
            await executeMutation(mutation)
        } catch (error) {
            // Retry logic
            if (mutation.retryCount < 3) {
                mutation.retryCount++
                failed.push(mutation)
            }
        }
    }
    
    // Sauvegarder échecs
    await AsyncStorage.setItem(
        'offline_mutations',
        JSON.stringify(failed)
    )
}
```

## 4.3 Implémentation UI/UX

### 4.3.1 Glass Morphism (GlassCard)

```typescript
export const GlassCard = ({ variant, glow, children, style }) => {
    const { colors } = useThemeStore()
    
    const variantColors = {
        default: colors.glass,
        accent: colors.glassActive,
        gold: 'rgba(201, 164, 108, 0.05)',
    }
    
    return (
        <Animated.View
            style={[
                {
                    backgroundColor: variantColors[variant],
                    borderColor: colors.glassBorder,
                    borderWidth: 1,
                    borderRadius: THEME.borderRadius.lg,
                    backdropFilter: 'blur(20px)',
                },
                glow && {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    )
}
```

### 4.3.2 Animations Reanimated

```typescript
// Fade in avec spring
export const FloatUp = ({ children, index = 0 }) => {
    return (
        <Animated.View
            entering={FadeInUp
                .delay(index * 100)
                .springify()
                .damping(15)
            }
        >
            {children}
        </Animated.View>
    )
}

// Staggered entries pour listes
export const StaggeredEntry = ({ children, index }) => {
    return (
        <Animated.View
            entering={FadeInUp
                .delay(index * 50)
                .springify()
            }
        >
            {children}
        </Animated.View>
    )
}

// Spring bounce pour interactions
export const SpringBounce = ({ children }) => {
    const scale = useSharedValue(1)
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))
    
    const onPressIn = () => {
        scale.value = withSpring(0.95, { damping: 12 })
    }
    
    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 15 })
    }
    
    return (
        <TapGestureHandler
            onActivated={onPressIn}
            onEnded={onPressOut}
        >
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </TapGestureHandler>
    )
}
```

### 4.3.3 Background Afro-Punk

```typescript
export const AfroPunkBackground = ({ showSlideshow, children }) => {
    const { colors } = useThemeStore()
    
    return (
        <View style={{ flex: 1, backgroundColor: colors.void }}>
            {/* Gradient overlay */}
            <LinearGradient
                colors={[colors.void, 'transparent', colors.void]}
                style={StyleSheet.absoluteFill}
            />
            
            {/* Slideshow culturel (optionnel) */}
            {showSlideshow && <AfricanSlideshow />}
            
            {/* Pattern Adinkra */}
            <Svg width="100%" height="100%">
                <Pattern id="adinkra" ... />
                <Rect width="100%" height="100%" fill="url(#adinkra)" />
            </Svg>
            
            {/* Contenu */}
            {children}
        </View>
    )
}
```

## 4.4 Configuration & Build

### 4.4.1 Scripts npm

```json
{
    "scripts": {
        "android": "react-native run-android",
        "ios": "react-native run-ios",
        "start": "react-native start",
        "lint": "eslint .",
        "test": "jest"
    }
}
```

### 4.4.2 Configuration TypeScript

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "commonjs",
        "lib": ["es2017"],
        "jsx": "react-native",
        "strict": true,
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true
    }
}
```

### 4.4.3 ESLint & Prettier

```javascript
// .eslintrc.js
module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
    },
}

// .prettierrc.js
module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    tabWidth: 4,
}
```

## 4.5 Déploiement

### 4.5.1 Pré-requis
```bash
# Installer dependencies
npm install

# Installer pods iOS (Mac uniquement)
cd ios && pod install && cd ..

# Configurer Supabase
# Éditer src/services/supabase/client.ts avec vos credentials
```

### 4.5.2 Développement
```bash
# Démarrer Metro bundler
npm start

# Build Android
npm run android

# Build iOS
npm run ios
```

### 4.5.3 Production
```bash
# Build APK Android
cd android && ./gradlew assembleRelease

# Build IPA iOS (Mac)
cd ios && xcodebuild -workspace SpotifunAfroPUNK.xcworkspace \
    -scheme SpotifunAfroPUNK \
    -configuration Release \
    -sdk iphoneos \
    -archivePath build/SpotifunAfroPUNK.xcarchive \
    archive
```

### 4.5.4 Migration Base de Données
```bash
# Exécuter dans Supabase Dashboard → SQL Editor
# Copier le contenu de supabase/migrations/001_initial_schema.sql
# Run Query
```

## 4.6 Tests

### 4.6.1 Tests Unitaires (Jest)
```typescript
// __tests__/App.test.tsx
import 'react-native'
import React from 'react'
import App from '../App'
import { render } from '@testing-library/react-native'

it('renders correctly', () => {
    render(<App />)
})
```

### 4.6.2 Linting
```bash
# Vérifier code quality
npm run lint

# Auto-fix
npx eslint . --fix
```

## 4.7 Monitoring & Debugging

### 4.7.1 Error Boundaries
```typescript
export class ErrorBoundary extends React.Component {
    state = { hasError: false }
    
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo)
        // Envoyer à Sentry ou autre service
    }
    
    render() {
        if (this.state.hasError) {
            return <FallbackUI />
        }
        return this.props.children
    }
}
```

### 4.7.2 Network Detection
```typescript
export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true)
    
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected && state.isInternetReachable)
        })
        
        return unsubscribe
    }, [])
    
    return { isConnected }
}
```

### 4.7.3 Logging
```typescript
// Logs structurés
console.log('[Player] Track loaded:', trackId)
console.warn('[Auth] Session expired')
console.error('[BLE] Connection failed:', error)

// Production: utiliser un service comme Sentry
// Sentry.captureException(error)
```

---

# ANNEXES

## A. Glossaire

| Terme | Définition |
|-------|-----------|
| **Afro-punk** | Genre musical fusionnant punk rock et traditions africaines |
| **Griot** | Conteur/musicien traditionnel ouest-africain |
| **Handoff** | Transfert de session playback entre devices |
| **Offline-first** | Architecture priorisant le fonctionnement hors-ligne |
| **Glass morphism** | Style UI avec effet de verre dépoli |
| **RLS** | Row Level Security (sécurité au niveau ligne PostgreSQL) |
| **Trigram** | Technique de recherche floue (3 caractères) |

## B. Resources

- **React Native**: https://reactnative.dev
- **Supabase**: https://supabase.com/docs
- **Zustand**: https://docs.pmnd.rs/zustand
- **Track Player**: https://react-native-track-player.js.org
- **Reanimated**: https://docs.swmansion.com/react-native-reanimated

## C. Licences

Toutes les dépendances utilisent des licences compatibles commercial:
- React Native: MIT
- Supabase: Apache 2.0
- Zustand: MIT
- Track Player: Apache 2.0

---

**Document Version**: 1.0  
**Date**: 19 Juin 2026  
**Auteur**: Équipe Spotifun Afropunk  
**Statut**: ✅ Opérationnel
