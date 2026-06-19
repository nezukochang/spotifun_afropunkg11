import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { startScanning, stopScanning, connectToDevice, sendHandoff } from '../../services/bluetooth/bleService';
import { GlassCard } from '../../shared/ui/GlassCard';
import { HandoffStatus } from '../../types';
import { THEME } from '../../shared/theme';

interface HandoffPanelProps {
    trackId: string;
    positionMs: number;
    onClose: () => void;
}

export const HandoffPanel: React.FC<HandoffPanelProps> = ({ trackId, positionMs, onClose }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [status, setStatus] = useState<HandoffStatus>('idle');

    useEffect(() => {
        handleToggleScan();
        return () => {
            stopScanning();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleScan = () => {
        if (isScanning) {
            stopScanning();
            setIsScanning(false);
            setStatus('idle');
        } else {
            setDevices([]);
            setIsScanning(true);
            setStatus('scanning');
            startScanning((device) => {
                setDevices(prev => {
                    if (prev.find(d => d.id === device.id)) { return prev; }
                    return [...prev, device];
                });
            });
        }
    };

    const handleConnect = async (device: Device) => {
        setConnectingId(device.id);
        setStatus('connecting');
        const success = await connectToDevice(device);
        if (success) {
            setStatus('sending');
            const handoffSuccess = await sendHandoff(trackId, positionMs);
            if (handoffSuccess) {
                setStatus('success');
                setTimeout(onClose, 2000);
            } else {
                setStatus('error');
            }
        } else {
            setStatus('error');
        }
        setConnectingId(null);
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>BLUETOOTH HANDOFF</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.positionInfo}>
                <Text style={styles.positionLabel}>POSITION: {Math.round(positionMs / 1000)}s</Text>
            </View>

            <View style={styles.scanSection}>
                <Text style={styles.subtitle}>
                    {status === 'scanning' ? 'SEARCHING FOR DEVICES...' : 'NEARBY DEVICES'}
                </Text>
                <TouchableOpacity style={styles.scanButton} onPress={handleToggleScan}>
                    <Text style={styles.scanButtonText}>{isScanning ? 'STOP' : 'RESCAN'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.deviceList}>
                {devices.length === 0 && !isScanning && (
                    <Text style={styles.emptyText}>NO DEVICES FOUND</Text>
                )}
                {devices.map(device => (
                    <TouchableOpacity
                        key={device.id}
                        style={styles.deviceItem}
                        onPress={() => handleConnect(device)}
                        disabled={status === 'connecting' || status === 'sending'}
                    >
                        <View>
                            <Text style={styles.deviceName}>{device.name || 'UNKNOWN DEVICE'}</Text>
                            <Text style={styles.deviceId}>{device.id}</Text>
                        </View>
                        {connectingId === device.id ? (
                            <ActivityIndicator color={THEME.colors.accent} size="small" />
                        ) : (
                            <Text style={styles.connectText}>CONNECT</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.statusFooter}>
                {status === 'sending' && <Text style={styles.statusText}>TRANSFERRING TRACK...</Text>}
                {status === 'success' && <Text style={[styles.statusText, { color: THEME.colors.accent }]}>HANDOFF COMPLETE</Text>}
                {status === 'error' && <Text style={[styles.statusText, { color: 'red' }]}>CONNECTION FAILED</Text>}
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: THEME.spacing.lg,
        maxHeight: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.lg,
    },
    title: {
        color: THEME.colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 2,
    },
    closeIcon: {
        color: THEME.colors.white,
        fontSize: 20,
    },
    positionInfo: {
        marginBottom: THEME.spacing.sm,
    },
    positionLabel: {
        color: THEME.colors.accent,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    scanSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    subtitle: {
        color: THEME.colors.gray[400],
        fontSize: 10,
        letterSpacing: 1,
    },
    scanButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: THEME.colors.accent,
    },
    scanButtonText: {
        color: THEME.colors.accent,
        fontSize: 10,
        fontWeight: '700',
    },
    deviceList: {
        minHeight: 150,
    },
    emptyText: {
        color: THEME.colors.gray[700],
        textAlign: 'center',
        marginTop: THEME.spacing.xl,
        fontSize: 12,
    },
    deviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    deviceName: {
        color: THEME.colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    deviceId: {
        color: THEME.colors.gray[400],
        fontSize: 10,
    },
    connectText: {
        color: THEME.colors.accent,
        fontSize: 12,
        fontWeight: '700',
    },
    statusFooter: {
        marginTop: THEME.spacing.md,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
        color: THEME.colors.white,
    },
});
