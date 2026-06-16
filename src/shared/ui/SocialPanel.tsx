import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { THEME } from '../theme';
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
    const userId = session?.user.id || 'anonymous';

    const [comments, setComments] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        loadComments();
        loadFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId, showAll]);

    const loadComments = async () => {
        setLoading(true);
        const { data } = await getComments(trackId, showAll ? 50 : 10);
        if (data) { setComments(data); }
        setLoading(false);
    };

    const loadFriends = async () => {
        const { data } = await getFriends(userId);
        if (data) { setFriends(data); }
    };

    const handleShare = async (friendId: string) => {
        await shareTrackWithFriend(trackId, friendId, userId);
        setSharing(false);
        Alert.alert('AFROPUNK SHARED', 'SONG SENT TO ANCESTOR');
    };

    const toggleExpansion = () => {
        setShowAll(!showAll);
        loadComments();
    };

    const renderComment = ({ item }: { item: any }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Text style={styles.username}>{item.profiles?.username || 'GRIOT'}</Text>
                <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.commentContent}>{item.content}</Text>
        </View>
    );

    const renderFooter = () => {
        if (!showAll && comments.length >= 10) {
            return (
                <TouchableOpacity onPress={toggleExpansion} style={styles.expandButton}>
                    <Text style={styles.arrowIcon}>▼</Text>
                    <Text style={styles.expandText}>LOAD MORE RESONANCE</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{views.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>VIEWS</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{likes.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>LIKES</Text>
                </View>
                <TouchableOpacity style={styles.stat} onPress={() => setSharing(!sharing)}>
                    <Text style={styles.statValue}>{sharing ? '✕' : '🚀'}</Text>
                    <Text style={styles.statLabel}>{sharing ? 'CANCEL' : 'SHARE'}</Text>
                </TouchableOpacity>
            </View>

            {sharing && (
                <View style={styles.friendsList}>
                    <Text style={styles.sectionTitle}>SEND TO FRIENDS</Text>
                    {friends.length === 0 ? (
                        <Text style={styles.friendName}>NO FRIENDS SYNCED</Text>
                    ) : (
                        friends.map(f => (
                            <TouchableOpacity key={f.id} style={styles.friendItem} onPress={() => handleShare(f.friend?.id)}>
                                <Text style={styles.friendName}>{f.friend?.username || 'GRIOT'}</Text>
                                <Text style={styles.shareIcon}>SEND</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}

            <View style={styles.commentsHeader}>
                <Text style={styles.sectionTitle}>RESONANCE (COMMENTS)</Text>
            </View>

            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                ListFooterComponent={renderFooter}
            />
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: { padding: THEME.spacing.lg, marginTop: THEME.spacing.lg },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: THEME.spacing.xl, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)', paddingBottom: THEME.spacing.lg },
    stat: { alignItems: 'center' },
    statValue: { color: THEME.colors.white, fontWeight: '700', fontSize: 18 },
    statLabel: { color: THEME.colors.gray[400], fontSize: 10, letterSpacing: 1, marginTop: 4 },
    commentsHeader: { marginBottom: THEME.spacing.md },
    sectionTitle: { color: THEME.colors.white, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    commentItem: { marginBottom: THEME.spacing.md, paddingBottom: THEME.spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    username: { color: THEME.colors.accent, fontSize: 12, fontWeight: '700' },
    time: { color: THEME.colors.gray[400], fontSize: 10 },
    commentContent: { color: THEME.colors.white, fontSize: 13, lineHeight: 18 },
    expandButton: { alignItems: 'center', paddingVertical: THEME.spacing.md },
    arrowIcon: { color: THEME.colors.gray[400], fontSize: 18 },
    expandText: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '700', letterSpacing: 1 },
    friendsList: { backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.lg },
    friendItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: THEME.spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
    friendName: { color: THEME.colors.white, fontSize: 13 },
    shareIcon: { color: THEME.colors.accent, fontSize: 12, fontWeight: '700' },
});
