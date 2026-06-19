import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { THEME } from '../../shared/theme';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useI18nStore } from '../../shared/i18n/useI18nStore';
import { Track } from 'react-native-track-player';

interface QueueModalProps {
    visible: boolean;
    onClose: () => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({ visible, onClose }) => {
    const { queue, queueIndex, playFromQueue, removeFromQueue } = usePlayerStore();
    const { t } = useI18nStore();

    const renderItem = ({ item, index }: { item: Track; index: number }) => {
        const isCurrent = index === queueIndex;
        const artworkUri = item.artwork as string | undefined;

        return (
            <TouchableOpacity
                style={[styles.item, isCurrent && styles.currentItem]}
                onPress={() => playFromQueue(index)}
                onLongPress={() => {
                    if (!isCurrent) { removeFromQueue(index); }
                }}
                activeOpacity={0.7}
            >
                {/* Position number / playing indicator */}
                <View style={styles.indexWrap}>
                    <Text style={[styles.index, isCurrent && styles.currentIndex]}>
                        {isCurrent ? '▶' : `${index + 1}`}
                    </Text>
                </View>

                {/* Mini artwork */}
                <View style={styles.artworkWrap}>
                    {artworkUri ? (
                        <Image source={{ uri: artworkUri }} style={styles.artwork} />
                    ) : (
                        <View style={[styles.artwork, styles.artFallback]}>
                            <Text style={styles.fallbackIcon}>♫</Text>
                        </View>
                    )}
                </View>

                {/* Track info */}
                <View style={styles.info}>
                    <Text style={[styles.title, isCurrent && styles.currentTitle]} numberOfLines={1}>
                        {item.title || t.unknownArtist}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {item.artist || t.unknownArtist}
                    </Text>
                </View>

                {/* Remove button (if not current) */}
                {!isCurrent && (
                    <TouchableOpacity
                        onPress={() => removeFromQueue(index)}
                        style={styles.removeBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.removeIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{t.queue}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        {queue.length} {t.tracks}
                    </Text>

                    {/* Queue list */}
                    <FlatList
                        data={queue}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.id || 'track'}-${index}`}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <Text style={styles.empty}>{t.emptyQueue}</Text>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: THEME.colors.void,
        borderRadius: THEME.borderRadius.lg,
        maxHeight: '80%',
        paddingTop: THEME.spacing.lg,
        paddingBottom: THEME.spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.xl,
        marginBottom: THEME.spacing.sm,
    },
    headerTitle: {
        color: THEME.colors.white,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    closeBtn: {
        color: THEME.colors.white,
        fontSize: 20,
    },
    subtitle: {
        color: THEME.colors.gray[400],
        fontSize: 10,
        letterSpacing: 1,
        paddingHorizontal: THEME.spacing.xl,
        marginBottom: THEME.spacing.lg,
    },
    list: {
        paddingHorizontal: THEME.spacing.lg,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.md,
        marginBottom: 4,
    },
    currentItem: {
        backgroundColor: THEME.colors.glassActive,
        borderWidth: 1,
        borderColor: 'rgba(255, 87, 51, 0.2)',
    },
    indexWrap: {
        width: 28,
        alignItems: 'center',
    },
    index: {
        color: THEME.colors.gray[400],
        fontSize: 12,
        fontWeight: '700',
    },
    currentIndex: {
        color: THEME.colors.accent,
        fontSize: 14,
    },
    artworkWrap: {
        width: 36,
        height: 36,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: THEME.spacing.sm,
    },
    artwork: {
        width: 36,
        height: 36,
    },
    artFallback: {
        backgroundColor: THEME.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallbackIcon: {
        color: THEME.colors.gray[400],
        fontSize: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        color: THEME.colors.white,
        fontSize: 13,
        fontWeight: '600',
    },
    currentTitle: {
        color: THEME.colors.accent,
    },
    artist: {
        color: THEME.colors.gray[400],
        fontSize: 11,
        marginTop: 1,
    },
    removeBtn: {
        padding: 4,
    },
    removeIcon: {
        color: THEME.colors.gray[700],
        fontSize: 14,
    },
    empty: {
        color: THEME.colors.gray[700],
        textAlign: 'center',
        marginTop: THEME.spacing.xxl,
        fontSize: 12,
        letterSpacing: 1,
    },
});
