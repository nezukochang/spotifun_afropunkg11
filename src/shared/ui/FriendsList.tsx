import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../i18n/useI18nStore';
import { getFriends } from '../../services/catalog/socialService';
import { useAuthStore } from '../../stores/useAuthStore';
import { StaggeredEntry } from './Animations';

export const FriendsList = () => {
    const { user } = useAuthStore();
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const [friends, setFriends] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            getFriends(user.id).then(({ data }) => {
                if (data) { setFriends(data); }
            }).catch(() => {});
        }
    }, [user]);

    const renderFriend = ({ item, index }: { item: any, index: number }) => (
        <StaggeredEntry index={index}>
            <TouchableOpacity style={styles.friendItem}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: item.friend?.avatar_url || 'https://picsum.photos/100/100?random=10' }}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineIndicator} />
                </View>
                <View style={styles.friendInfo}>
                    <Text style={[styles.username, { color: colors.white }]}>{item.friend?.username || 'Username'}</Text>
                    <Text style={[styles.status, { color: colors.gray[400] }]}>ONLINE</Text>
                </View>
                <Text style={[styles.sendIcon, { color: colors.accent }]}>➔</Text>
            </TouchableOpacity>
        </StaggeredEntry>
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.white }]}>{t.tribeConnected}</Text>
            <FlatList
                data={friends.length > 0 ? friends : [{ id: 'mock-1' }]}
                renderItem={renderFriend}
                keyExtractor={item => item.id}
                scrollEnabled={false}
            />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
                <Text style={[styles.addText, { color: colors.white }]}>{t.addToTribe}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: THEME.spacing.xl },
    title: { color: THEME.colors.white, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: THEME.spacing.lg },
    friendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.md, padding: THEME.spacing.sm },
    avatarContainer: { position: 'relative' },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: THEME.colors.void },
    friendInfo: { flex: 1, marginLeft: THEME.spacing.md },
    username: { color: THEME.colors.white, fontWeight: '700', fontSize: 14 },
    status: { color: THEME.colors.gray[400], fontSize: 10, fontWeight: '600', marginTop: 2 },
    sendIcon: { color: THEME.colors.white, fontSize: 18, opacity: 0.5 },
    addButton: { marginTop: THEME.spacing.md, padding: THEME.spacing.md, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: THEME.borderRadius.md, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    addText: { color: THEME.colors.white, fontWeight: '700', letterSpacing: 1, fontSize: 11 },
});
