// ═══════════════════════════════════════════════════════════════
// Spotifun Afropunk i18n - Internationalization
// Supports: English, French, Japanese
// ═══════════════════════════════════════════════════════════════

export type Locale = 'en' | 'fr' | 'ja';

export interface TranslationStrings {
    // Auth
    login: string;
    signUp: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    welcomeBack: string;
    createAccount: string;
    noAccount: string;
    hasAccount: string;
    loginFailed: string;
    signUpFailed: string;
    checkEmail: string;

    // Navigation
    home: string;
    search: string;
    library: string;
    player: string;
    settings: string;

    // Home
    recentlyPlayed: string;
    topMixes: string;
    forYou: string;
    newReleases: string;
    allGenres: string;
    tracks: string;

    // Player
    nowPlaying: string;
    upNext: string;
    queue: string;
    lyrics: string;
    shuffle: string;
    repeat: string;
    addToQueue: string;
    removeFromQueue: string;
    clearQueue: string;
    emptyQueue: string;
    emptyQueueHint: string;

    // Library
    myLibrary: string;
    likedTracks: string;
    playlists: string;
    liked: string;
    createPlaylist: string;
    noPlaylists: string;
    noLikedTracks: string;
    noPlaylistsHint: string;
    addTracks: string;
    delete: string;

    // Search
    searchPlaceholder: string;
    trending: string;
    genres: string;
    noResults: string;
    noResultsHint: string;
    topResults: string;

    // Settings
    settingsTitle: string;
    account: string;
    theme: string;
    brightness: string;
    dark: string;
    mid: string;
    light: string;
    language: string;
    audioQuality: string;
    storage: string;
    clearCache: string;
    cacheSize: string;
    about: string;
    version: string;
    premium: string;
    upgradeToPremium: string;
    premiumFeatures: string;
    premiumSubtitle: string;
    getPremium: string;
    currentPlan: string;
    free: string;

    // Social
    friends: string;
    chat: string;
    noFriends: string;
    addFriend: string;
    comments: string;
    noComments: string;
    addComment: string;
    send: string;

    // Offline
    offlineMode: string;
    downloading: string;
    downloaded: string;
    removeDownload: string;

    // Common
    save: string;
    cancel: string;
    done: string;
    loading: string;
    retry: string;
    ok: string;
    error: string;
    success: string;
    networkError: string;

    // Onboarding
    onboarding1Title: string;
    onboarding1Desc: string;
    onboarding2Title: string;
    onboarding2Desc: string;
    onboarding3Title: string;
    onboarding3Desc: string;
    next: string;
    getStarted: string;
    skip: string;

    // Library extras
    yourCollection: string;
    tribe: string;
    createPlaylistBtn: string;
    newPlaylist: string;
    playlistNamePlaceholder: string;
    rename: string;
    whatToDo: string;
    trackCount: string;
    likedTotal: string;
    recentlyPlayedShort: string;

    // Player extras
    handoff: string;
    spotifunTrack: string;
    unknownArtist: string;

    // Social extras
    views: string;
    likesLabel: string;
    shareAction: string;
    sendToFriends: string;
    noFriendsConnected: string;
    beFirstToComment: string;
    loadMore: string;
    tribeConnected: string;
    addToTribe: string;

    // Search extras
    recentSearches: string;
    clear: string;
    tracksTab: string;
    artistsTab: string;
    noResultsFound: string;
    tryDifferent: string;

    // Empty / error states
    noTracksFound: string;
    noTracksHint: string;
    emptyPlaylist: string;
    emptyPlaylistHint: string;
    noCommentsHint: string;
    noFriendsYet: string;
    noFriendsHint: string;
    retryConnection: string;

    // Artist management
    artists: string;
    createArtist: string;
    artistName: string;
    artistGenres: string;
    addTracksToArtist: string;
    noArtists: string;
    followers: string;
}

// ─── English ─────────────────────────────────────────────────
const en: TranslationStrings = {
    login: 'Log In',
    signUp: 'Sign Up',
    logout: 'Log Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginFailed: 'Invalid email or password',
    signUpFailed: 'Could not create account',
    checkEmail: 'Check your email to confirm!',

    home: 'Home',
    search: 'Search',
    library: 'Library',
    player: 'Player',
    settings: 'Settings',

    recentlyPlayed: 'RECENTLY PLAYED',
    topMixes: 'Top Mixes',
    forYou: 'For You',
    newReleases: 'NEW RELEASES',
    allGenres: 'All',
    tracks: 'tracks',

    nowPlaying: 'NOW PLAYING',
    upNext: 'Up Next',
    queue: 'Queue',
    lyrics: 'Lyrics',
    shuffle: 'Shuffle',
    repeat: 'Repeat',
    addToQueue: 'Add to Queue',
    removeFromQueue: 'Remove',
    clearQueue: 'Clear',
    emptyQueue: 'Queue is empty',
    emptyQueueHint: 'Add tracks from the player',

    myLibrary: 'My Library',
    likedTracks: 'Liked Tracks',
    playlists: 'Playlists',
    liked: 'LIKED',
    createPlaylist: 'New Playlist',
    noPlaylists: 'No playlists yet',
    noLikedTracks: 'No liked tracks',
    noPlaylistsHint: 'Tap + to create one',
    addTracks: 'Add Tracks',
    delete: 'Delete',

    searchPlaceholder: 'Search tracks, artists, genres...',
    trending: 'TRENDING NOW',
    genres: 'Genres',
    noResults: 'No results',
    noResultsHint: 'Try different keywords',
    topResults: 'TOP RESULTS',

    settingsTitle: 'Settings',
    account: 'Account',
    theme: 'Theme',
    brightness: 'Brightness',
    dark: 'Dark',
    mid: 'Mid',
    light: 'Light',
    language: 'Language',
    audioQuality: 'Audio Quality',
    storage: 'Storage',
    clearCache: 'Clear Cache',
    cacheSize: 'Cache Size',
    about: 'About',
    version: 'Version',
    premium: 'Premium',
    upgradeToPremium: 'Upgrade to Premium',
    premiumFeatures: 'Premium Features',
    premiumSubtitle: 'Unlock the full experience',
    getPremium: 'Get Premium',
    currentPlan: 'Current Plan',
    free: 'Free',

    friends: 'Friends',
    chat: 'Chat',
    noFriends: 'No friends yet',
    addFriend: 'Add Friend',
    comments: 'Comments',
    noComments: 'No comments yet',
    addComment: 'Add a comment...',
    send: 'Send',

    offlineMode: 'Offline Mode',
    downloading: 'Downloading...',
    downloaded: 'Downloaded',
    removeDownload: 'Remove Download',

    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    loading: 'Loading...',
    retry: 'Retry',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    networkError: 'No internet connection',

    onboarding1Title: 'SPOTIFUN AFROPUNK',
    onboarding1Desc: 'The future of Afro-centric music streaming',
    onboarding2Title: 'TRIBE',
    onboarding2Desc: 'Connect with friends and discover music together',
    onboarding3Title: 'OFFLINE',
    onboarding3Desc: 'Download and listen anywhere, even without internet',
    next: 'NEXT',
    getStarted: 'GET STARTED',
    skip: 'Skip',

    yourCollection: 'YOUR COLLECTION',
    tribe: 'TRIBE',
    createPlaylistBtn: 'CREATE PLAYLIST',
    newPlaylist: 'NEW PLAYLIST',
    playlistNamePlaceholder: 'Playlist name...',
    rename: 'RENAME',
    whatToDo: 'What to do?',
    trackCount: 'tracks',
    likedTotal: 'TOTAL',
    recentlyPlayedShort: 'RECENTLY PLAYED',

    handoff: 'HANDOFF',
    spotifunTrack: 'SPOTIFUN TRACK',
    unknownArtist: 'Unknown Artist',

    views: 'VIEWS',
    likesLabel: 'LIKES',
    shareAction: 'SHARE',
    sendToFriends: 'SEND TO FRIENDS',
    noFriendsConnected: 'No friends connected yet',
    beFirstToComment: 'No comments yet. Be the first!',
    loadMore: 'LOAD MORE',
    tribeConnected: 'TRIBE CONNECTED',
    addToTribe: '+ ADD TO TRIBE',

    recentSearches: 'RECENT SEARCHES',
    clear: 'CLEAR',
    tracksTab: 'TRACKS',
    artistsTab: 'ARTISTS',
    noResultsFound: 'NO RESULTS',
    tryDifferent: 'Try different keywords',

    noTracksFound: 'Library Empty',
    noTracksHint: 'Tracks you like will appear here',
    emptyPlaylist: 'No tracks yet',
    emptyPlaylistHint: 'Browse the catalog to add tracks',
    noFriendsYet: 'No tribe members yet',
    noFriendsHint: 'Invite friends to share music',
    retryConnection: 'Pull down to retry',
    noCommentsHint: 'Be the first to comment',

    artists: 'Artists',
    createArtist: 'Create Artist',
    artistName: 'Artist Name',
    artistGenres: 'Genres',
    addTracksToArtist: 'Add Tracks',
    noArtists: 'No artists created yet',
    followers: 'followers',
};

// ─── French ──────────────────────────────────────────────────
const fr: TranslationStrings = {
    login: 'Connexion',
    signUp: "S'inscrire",
    logout: 'Deconnexion',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    welcomeBack: 'Bon retour',
    createAccount: 'Creer un compte',
    noAccount: "Pas encore de compte?",
    hasAccount: 'Deja un compte?',
    loginFailed: 'Email ou mot de passe invalide',
    signUpFailed: 'Impossible de creer le compte',
    checkEmail: 'Verifiez votre email pour confirmer!',

    home: 'Accueil',
    search: 'Recherche',
    library: 'Bibliotheque',
    player: 'Lecteur',
    settings: 'Parametres',

    recentlyPlayed: 'ECOUTES RECEMMENT',
    topMixes: 'Top Mixes',
    forYou: 'Pour Toi',
    newReleases: 'NOUVEAUTES',
    allGenres: 'Tous',
    tracks: 'titres',

    nowPlaying: 'EN LECTURE',
    upNext: 'A suivre',
    queue: 'File d\'attente',
    lyrics: 'Paroles',
    shuffle: 'Aleatoire',
    repeat: 'Repeter',
    addToQueue: 'Ajouter a la file',
    removeFromQueue: 'Retirer',
    clearQueue: 'Vider',
    emptyQueue: 'File vide',
    emptyQueueHint: 'Ajoutez des titres depuis le lecteur',

    myLibrary: 'Ma Bibliotheque',
    likedTracks: 'Titres Aimes',
    playlists: 'Playlists',
    liked: 'AIME',
    createPlaylist: 'Nouvelle Playlist',
    noPlaylists: 'Pas encore de playlists',
    noLikedTracks: 'Pas de titres aimes',
    noPlaylistsHint: 'Appuyez + pour en creer une',
    addTracks: 'Ajouter des titres',
    delete: 'Supprimer',

    searchPlaceholder: 'Rechercher titres, artistes, genres...',
    trending: 'TENDANCES',
    genres: 'Genres',
    noResults: 'Aucun resultat',
    noResultsHint: 'Essayez d\'autres mots-cles',
    topResults: 'MEILLEURS RESULTATS',

    settingsTitle: 'Parametres',
    account: 'Compte',
    theme: 'Theme',
    brightness: 'Luminosite',
    dark: 'Sombre',
    mid: 'Moyen',
    light: 'Clair',
    language: 'Langue',
    audioQuality: 'Qualite Audio',
    storage: 'Stockage',
    clearCache: 'Vider le Cache',
    cacheSize: 'Taille du Cache',
    about: 'A propos',
    version: 'Version',
    premium: 'Premium',
    upgradeToPremium: 'Passer au Premium',
    premiumFeatures: 'Fonctionnalites Premium',
    premiumSubtitle: 'Debloquez l\'experience complete',
    getPremium: 'Obtenir Premium',
    currentPlan: 'Forfait Actuel',
    free: 'Gratuit',

    friends: 'Amis',
    chat: 'Discussion',
    noFriends: 'Pas encore d\'amis',
    addFriend: 'Ajouter un Ami',
    comments: 'Commentaires',
    noComments: 'Pas encore de commentaires',
    addComment: 'Ajouter un commentaire...',
    send: 'Envoyer',

    offlineMode: 'Mode Hors-ligne',
    downloading: 'Telechargement...',
    downloaded: 'Telecharge',
    removeDownload: 'Supprimer le telechargement',

    save: 'Enregistrer',
    cancel: 'Annuler',
    done: 'Terminer',
    loading: 'Chargement...',
    retry: 'Reessayer',
    ok: 'OK',
    error: 'Erreur',
    success: 'Succes',
    networkError: 'Pas de connexion internet',

    onboarding1Title: 'SPOTIFUN AFROPUNK',
    onboarding1Desc: 'Le futur du streaming musical Afro-centrique',
    onboarding2Title: 'TRIBU',
    onboarding2Desc: 'Connectez-vous avec vos amis et decouvrez la musique ensemble',
    onboarding3Title: 'HORS-LIGNE',
    onboarding3Desc: 'Telechargez et ecoutez partout, meme sans internet',
    next: 'SUIVANT',
    getStarted: 'COMMENCER',
    skip: 'Passer',

    yourCollection: 'VOTRE COLLECTION',
    tribe: 'TRIBU',
    createPlaylistBtn: 'CREER UNE PLAYLIST',
    newPlaylist: 'NOUVELLE PLAYLIST',
    playlistNamePlaceholder: 'Nom de la playlist...',
    rename: 'RENOMMER',
    whatToDo: 'Que faire ?',
    trackCount: 'morceaux',
    likedTotal: 'TOTAL',
    recentlyPlayedShort: 'ECOUTES RECEMMENT',

    handoff: 'TRANSFERT',
    spotifunTrack: 'MORCEAU SPOTIFUN',
    unknownArtist: 'Artiste Inconnu',

    views: 'VUES',
    likesLabel: 'JAIME',
    shareAction: 'PARTAGER',
    sendToFriends: 'ENVOYER AUX AMIS',
    noFriendsConnected: 'Pas encore d\'amis connectes',
    beFirstToComment: 'Pas encore de commentaires. Soyez le premier!',
    loadMore: 'VOIR PLUS',
    tribeConnected: 'TRIBU CONNECTEE',
    addToTribe: '+ AJOUTER A LA TRIBU',

    recentSearches: 'RECHERCHES RECENTES',
    clear: 'EFFACER',
    tracksTab: 'MORCEAUX',
    artistsTab: 'ARTISTES',
    noResultsFound: 'AUCUN RESULTAT',
    tryDifferent: 'Essayez d\'autres mots-cles',

    artists: 'Artistes',
    createArtist: 'Creer un Artiste',
    artistName: 'Nom de l\'Artiste',
    artistGenres: 'Genres',
    addTracksToArtist: 'Ajouter des Morceaux',
    noArtists: 'Pas encore d\'artistes crees',
    followers: 'abonnes',

    noTracksFound: 'Bibliotheque vide',
    noTracksHint: 'Vos titres preferes apparaitront ici',
    emptyPlaylist: 'Aucun titre',
    emptyPlaylistHint: 'Parcourez le catalogue pour ajouter des titres',
    noFriendsYet: 'Aucun membre de la tribu',
    noFriendsHint: 'Invitez des amis pour partager la musique',
    retryConnection: 'Tirez vers le bas pour reessayer',
    noCommentsHint: 'Soyez le premier a commenter',
};

// ─── Japanese ────────────────────────────────────────────────
const ja: TranslationStrings = {
    login: 'ログイン',
    signUp: '新規登録',
    logout: 'ログアウト',
    email: 'メール',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    welcomeBack: 'おかえりなさい',
    createAccount: 'アカウント作成',
    noAccount: 'アカウントをお持ちでないですか?',
    hasAccount: 'すでにアカウントをお持ちですか?',
    loginFailed: 'メールまたはパスワードが無効です',
    signUpFailed: 'アカウントを作成できませんでした',
    checkEmail: '確認メールをチェックしてください!',

    home: 'ホーム',
    search: '検索',
    library: 'ライブラリ',
    player: 'プレイヤー',
    settings: '設定',

    recentlyPlayed: '最近再生した曲',
    topMixes: 'トップミックス',
    forYou: 'あなたへのおすすめ',
    newReleases: '新着リリース',
    allGenres: 'すべて',
    tracks: '曲',

    nowPlaying: '再生中',
    upNext: '次の曲',
    queue: 'キュー',
    lyrics: '歌詞',
    shuffle: 'シャッフル',
    repeat: 'リピート',
    addToQueue: 'キューに追加',
    removeFromQueue: '削除',
    clearQueue: 'クリア',
    emptyQueue: 'キューは空です',
    emptyQueueHint: 'プレイヤーから曲を追加',

    myLibrary: 'マイライブラリ',
    likedTracks: 'お気に入りの曲',
    playlists: 'プレイリスト',
    liked: 'お気に入り',
    createPlaylist: '新しいプレイリスト',
    noPlaylists: 'プレイリストはまだありません',
    noLikedTracks: 'お気に入りの曲はありません',
    noPlaylistsHint: '+をタップして作成',
    addTracks: '曲を追加',
    delete: '削除',

    searchPlaceholder: '曲、アーティスト、ジャンルを検索...',
    trending: 'トレンド',
    genres: 'ジャンル',
    noResults: '結果なし',
    noResultsHint: '別のキーワードを試してください',
    topResults: 'トップ結果',

    settingsTitle: '設定',
    account: 'アカウント',
    theme: 'テーマ',
    brightness: '明るさ',
    dark: 'ダーク',
    mid: 'ミドル',
    light: 'ライト',
    language: '言語',
    audioQuality: '音質',
    storage: 'ストレージ',
    clearCache: 'キャッシュをクリア',
    cacheSize: 'キャッシュサイズ',
    about: 'アプリについて',
    version: 'バージョン',
    premium: 'プレミアム',
    upgradeToPremium: 'プレミアムにアップグレード',
    premiumFeatures: 'プレミアム機能',
    premiumSubtitle: 'フル体験をアンロック',
    getPremium: 'プレミアムを取得',
    currentPlan: '現在のプラン',
    free: '無料',

    friends: 'フレンド',
    chat: 'チャット',
    noFriends: 'フレンドはまだいません',
    addFriend: 'フレンドを追加',
    comments: 'コメント',
    noComments: 'コメントはまだありません',
    addComment: 'コメントを追加...',
    send: '送信',

    offlineMode: 'オフラインモード',
    downloading: 'ダウンロード中...',
    downloaded: 'ダウンロード済み',
    removeDownload: 'ダウンロードを削除',

    save: '保存',
    cancel: 'キャンセル',
    done: '完了',
    loading: '読み込み中...',
    retry: '再試行',
    ok: 'OK',
    error: 'エラー',
    success: '成功',
    networkError: 'インターネット接続がありません',

    onboarding1Title: 'SPOTIFUN AFROPUNK',
    onboarding1Desc: 'アフロ中心の音楽ストリーミングの未来',
    onboarding2Title: 'トライブ',
    onboarding2Desc: '友達とつながって一緒に音楽を発見しよう',
    onboarding3Title: 'オフライン',
    onboarding3Desc: 'ダウンロードしてどこでも、インターネットなしでも聴けます',
    next: '次へ',
    getStarted: 'はじめる',
    skip: 'スキップ',

    yourCollection: 'あなたのコレクション',
    tribe: 'トライブ',
    createPlaylistBtn: 'プレイリスト作成',
    newPlaylist: '新しいプレイリスト',
    playlistNamePlaceholder: 'プレイリスト名...',
    rename: '名前変更',
    whatToDo: 'どうしますか？',
    trackCount: '曲',
    likedTotal: '合計',
    recentlyPlayedShort: '最近再生',

    handoff: 'ハンドオフ',
    spotifunTrack: 'SPOTIFUNトラック',
    unknownArtist: '不明なアーティスト',

    views: '再生回数',
    likesLabel: 'いいね',
    shareAction: 'シェア',
    sendToFriends: '友達に送信',
    noFriendsConnected: 'まだ友達がいません',
    beFirstToComment: 'まだコメントがありません。最初にコメントしよう！',
    loadMore: 'もっと見る',
    tribeConnected: '接続中のトライブ',
    addToTribe: '+ トライブに追加',

    recentSearches: '最近の検索',
    clear: 'クリア',
    tracksTab: '曲',
    artistsTab: 'アーティスト',
    noResultsFound: '結果なし',
    tryDifferent: '別のキーワードを試してください',

    artists: 'アーティスト',
    createArtist: 'アーティスト作成',
    artistName: 'アーティスト名',
    artistGenres: 'ジャンル',
    addTracksToArtist: '曲を追加',
    noArtists: 'まだアーティストがいません',
    followers: 'フォロワー',

    noTracksFound: 'ライブラリは空です',
    noTracksHint: 'お気に入りの曲がここに表示されます',
    emptyPlaylist: '曲がありません',
    emptyPlaylistHint: 'カタログを閲覧して曲を追加',
    noFriendsYet: 'トライブメンバーがいません',
    noFriendsHint: '友達を招待して音楽を共有',
    retryConnection: '引き下げて再試行',
    noCommentsHint: '最初にコメントしましょう',
};

// ─── Registry ────────────────────────────────────────────────
export const TRANSLATIONS: Record<Locale, TranslationStrings> = { en, fr, ja };

export const LOCALE_LABELS: Record<Locale, string> = {
    en: 'English',
    fr: 'Francais',
    ja: '日本語',
};
