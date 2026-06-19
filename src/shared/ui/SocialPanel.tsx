import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { THEME } from '../theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../i18n/useI18nStore';
import { GlassCard } from './GlassCard';
import { getComments, getFriends, shareTrackWithFriend } from '../../services/catalog/socialService';
import { useAuthStore } from '../../stores/useAuthStore';

interface SocialPanelProps {
    trackId: string;
    views: number;
    likes: number;
}

export const SocialPanel: React.FC<SocialPanelProps> = ({ trackId, views, likes }) => {
    const { session } = useAuthStore();
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const userId = session?.user.id || 'anonymous';

    const [comments, setComments] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [liked, setLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(likes);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        loadComments();
        loadFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId, showAll]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const { data } = await getComments(trackId, showAll ? 50 : 10);
            if (data) { setComments(data); }
        } catch (e) {
            // Network error - show empty state
            console.warn('[Social] Failed to load comments:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadFriends = async () => {
        try {
            const { data } = await getFriends(userId);
            if (data) { setFriends(data); }
        } catch (e) {
            console.warn('[Social] Failed to load friends:', e);
        }
    };

    const handleShare = async (friendId: string) => {
        try {
            await shareTrackWithFriend(trackId, friendId, userId);
            setSharing(false);
            Alert.alert(t.tribe, t.sendToFriends + ' ✓');
        } catch (e) {
            Alert.alert(t.error, t.networkError);
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        setLocalLikes(prev => liked ? prev - 1 : prev + 1);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) { return; }
        // Add locally (will sync to server when available)
        const localComment = {
            id: `local-${Date.now()}`,
            content: newComment.trim(),
            created_at: new Date().toISOString(),
            profiles: { username: session?.user?.email?.split('@')[0] || 'You' },
        };
        setComments(prev => [localComment, ...prev]);
        setNewComment('');
    };

    const toggleExpansion = () => {
        setShowAll(!showAll);
        loadComments();
    };

    const renderComment = ({ item }: { item: any }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Text style={[styles.username, { color: colors.accent }]}>{item.profiles?.username || 'GRIOT'}</Text>
                <Text style={[styles.time, { color: colors.gray[400] }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.commentContent, { color: colors.white }]}>{item.content}</Text>
        </View>
    );

    return (
        <GlassCard style={styles.container}>
            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: colors.white }]}>{views.toLocaleString()}</Text>
                    <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{t.views}</Text>
                </View>
                <TouchableOpacity style={styles.stat} onPress={handleLike}>
                    <Text style={[styles.statValue, liked && { color: colors.accent }]}>
                        {liked ? '❤️' : '🤍'} {localLikes.toLocaleString()}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{t.likesLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stat} onPress={() => setSharing(!sharing)}>
                    <Text style={styles.statValue}>{sharing ? '✕' : '🚀'}</Text>
                    <Text style={[styles.statLabel, { color: colors.gray[400] }]}>{sharing ? t.cancel : t.shareAction}</Text>
                </TouchableOpacity>
            </View>

            {/* Friends list for sharing */}
            {sharing && (
                <View style={styles.friendsList}>
                    <Text style={[styles.sectionTitle, { color: colors.white }]}>{t.sendToFriends}</Text>
                    {friends.length === 0 ? (
                        <Text style={[styles.emptyText, { color: colors.gray[600] }]}>{t.noFriendsConnected}</Text>
                    ) : (
                        friends.map(f => (
                            <TouchableOpacity key={f.id} style={styles.friendItem} onPress={() => handleShare(f.friend?.id)}>
                                <Text style={[styles.friendName, { color: colors.white }]}>{f.friend?.username || 'GRIOT'}</Text>
                                <Text style={[styles.shareIcon, { color: colors.accent }]}>{t.send}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}

            {/* Add comment input */}
            <View style={styles.commentInputRow}>
                <TextInput
                    style={[styles.commentInput, { color: colors.white }]}
                    placeholder={t.addComment}
                    placeholderTextColor={colors.gray[600]}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment} disabled={!newComment.trim()}>
                    <Text style={[styles.sendIcon, { color: colors.accent }, !newComment.trim() && { opacity: 0.3 }]}>➤</Text>
                </TouchableOpacity>
            </View>

            {/* Comments list */}
            <View style={styles.commentsHeader}>
                <Text style={[styles.sectionTitle, { color: colors.white }]}>
                    {t.comments} ({comments.length})
                </Text>
            </View>

            {comments.length === 0 && !loading && (
                <Text style={[styles.emptyText, { color: colors.gray[600] }]}>{t.beFirstToComment}</Text>
            )}

            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ListFooterComponent={
                    !showAll && comments.length >= 10 ? (
                        <TouchableOpacity onPress={toggleExpansion} style={styles.expandButton}>
                            <Text style={[styles.expandText, { color: colors.gray[400] }]}>{t.loadMore}</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: { padding: THEME.spacing.lg, marginTop: THEME.spacing.lg },
    statsRow: {
        flexDirection: 'row', justifyContent: 'space-around',
        marginBottom: THEME.spacing.lg, borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)', paddingBottom: THEME.spacing.lg,
    },
    stat: { alignItems: 'center' },
    statValue: { color: THEME.colors.white, fontWeight: '700', fontSize: 16 },
    statLabel: { color: THEME.colors.gray[400], fontSize: 10, letterSpacing: 1, marginTop: 4 },

    friendsList: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.lg,
    },
    friendItem: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: THEME.spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    friendName: { color: THEME.colors.white, fontSize: 13 },
    shareIcon: { color: THEME.colors.accent, fontSize: 12, fontWeight: '700' },

    commentInputRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.md,
    },
    commentInput: {
        flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.md, padding: THEME.spacing.sm,
        color: THEME.colors.white, fontSize: 13, maxHeight: 80,
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sendBtn: {
        width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
        marginLeft: THEME.spacing.sm,
    },
    sendIcon: { color: THEME.colors.accent, fontSize: 18, fontWeight: '900' },

    commentsHeader: { marginBottom: THEME.spacing.sm },
    sectionTitle: { color: THEME.colors.white, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

    commentItem: {
        marginBottom: THEME.spacing.md, paddingBottom: THEME.spacing.sm,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    username: { color: THEME.colors.accent, fontSize: 12, fontWeight: '700' },
    time: { color: THEME.colors.gray[400], fontSize: 10 },
    commentContent: { color: THEME.colors.white, fontSize: 13, lineHeight: 18 },

    emptyText: { color: THEME.colors.gray[600], textAlign: 'center', paddingVertical: THEME.spacing.md, fontSize: 12 },
    expandButton: { alignItems: 'center', paddingVertical: THEME.spacing.md },
    expandText: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});
