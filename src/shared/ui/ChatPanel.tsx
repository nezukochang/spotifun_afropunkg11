import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Animated, { FadeInUp, SlideInUp } from 'react-native-reanimated';
import { THEME } from '../theme';
import { useThemeStore } from '../../stores/useThemeStore';
import { useI18nStore } from '../i18n/useI18nStore';
import { GlassCard } from './GlassCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../stores/useAuthStore';

const CHAT_KEY = 'spotifun-afropunk_chat_messages';

interface ChatMessage {
    id: string;
    sender: string;
    senderEmail: string;
    content: string;
    timestamp: number;
}

// Demo messages for when there's no history
const DEMO_MESSAGES: ChatMessage[] = [
    {
        id: 'demo-1',
        sender: 'DJ Ancestors',
        senderEmail: 'dj@spotifunafropunk.app',
        content: 'Welcome to the Spotifun Afropunk tribe! Share your favorite tracks here.',
        timestamp: Date.now() - 3600000,
    },
    {
        id: 'demo-2',
        sender: 'Neon Griot',
        senderEmail: 'neon@spotifunafropunk.app',
        content: 'Just dropped a new Afro-Punk remix. Check it out!',
        timestamp: Date.now() - 1800000,
    },
];

export const ChatPanel = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { colors } = useThemeStore();
    const { t } = useI18nStore();
    const { session } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (visible) {
            loadMessages();
        }
    }, [visible]);

    const loadMessages = async () => {
        try {
            const raw = await AsyncStorage.getItem(CHAT_KEY);
            const saved: ChatMessage[] = raw ? JSON.parse(raw) : [];
            setMessages(saved.length > 0 ? saved : DEMO_MESSAGES);
        } catch {
            setMessages(DEMO_MESSAGES);
        }
    };

    const saveMessages = async (msgs: ChatMessage[]) => {
        try {
            await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
        } catch { /* ignore */ }
    };

    const handleSend = async () => {
        if (!input.trim()) { return; }
        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: session?.user?.email?.split('@')[0] || 'You',
            senderEmail: session?.user?.email || 'user@spotifunafropunk.app',
            content: input.trim(),
            timestamp: Date.now(),
        };
        const updated = [newMsg, ...messages];
        setMessages(updated);
        setInput('');
        await saveMessages(updated);
    };

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const isOwnMessage = (msg: ChatMessage) => msg.senderEmail === session?.user?.email;

    const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
        const own = isOwnMessage(item);
        return (
            <Animated.View entering={FadeInUp.delay(Math.min(index * 50, 300))}>
                <View style={[styles.messageRow, own && styles.ownMessageRow]}>
                    {!own && (
                        <View style={[styles.msgAvatar, { backgroundColor: colors.surfaceLight, borderColor: colors.glassBorder }]}>
                            <Text style={[styles.msgAvatarText, { color: colors.accentSecondary }]}>
                                {item.sender[0]?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={[styles.messageBubble, own ? { backgroundColor: colors.accent } : { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderWidth: 1 }]}>
                        {!own && (
                            <Text style={[styles.msgSender, { color: colors.accentSecondary }]}>{item.sender}</Text>
                        )}
                        <Text style={[styles.msgContent, { color: own ? colors.void : colors.white }]}>{item.content}</Text>
                        <Text style={[styles.msgTime, { color: own ? 'rgba(0,0,0,0.4)' : colors.gray[500] }]}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={[styles.container, { backgroundColor: colors.void }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.glassBorder }]}>
                    <Text style={[styles.headerTitle, { color: colors.white }]}>{t.chat}</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <Text style={[styles.closeBtn, { color: colors.gray[400] }]}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input */}
                <View style={[styles.inputRow, { borderTopColor: colors.glassBorder }]}>
                    <TextInput
                        style={[styles.input, { color: colors.white, backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
                        placeholder={t.addComment}
                        placeholderTextColor={colors.gray[600]}
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={500}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.accent : colors.glass }]}
                        onPress={handleSend}
                        disabled={!input.trim()}
                    >
                        <Text style={[styles.sendIcon, { color: input.trim() ? colors.white : colors.gray[500] }]}>➤</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: THEME.spacing.lg, borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 3 },
    closeBtn: { fontSize: 20, fontWeight: '700' },

    messagesList: { paddingHorizontal: THEME.spacing.lg, paddingVertical: THEME.spacing.md },

    messageRow: { flexDirection: 'row', marginBottom: THEME.spacing.md, maxWidth: '80%' },
    ownMessageRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },

    msgAvatar: {
        width: 32, height: 32, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
        marginRight: THEME.spacing.sm, borderWidth: 1,
    },
    msgAvatarText: { fontSize: 14, fontWeight: '800' },

    messageBubble: {
        borderRadius: THEME.borderRadius.lg,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        maxWidth: '85%',
    },
    msgSender: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
    msgContent: { fontSize: 14, lineHeight: 20 },
    msgTime: { fontSize: 9, marginTop: 4, textAlign: 'right' },

    inputRow: {
        flexDirection: 'row', alignItems: 'flex-end',
        padding: THEME.spacing.md, borderTopWidth: 1,
    },
    input: {
        flex: 1, borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.sm, paddingHorizontal: THEME.spacing.md,
        fontSize: 14, maxHeight: 100, borderWidth: 1,
    },
    sendBtn: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        marginLeft: THEME.spacing.sm,
    },
    sendIcon: { fontSize: 18, fontWeight: '900' },
});
