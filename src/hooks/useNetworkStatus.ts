import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

export interface NetworkStatus {
    isConnected: boolean;
    connectionType: NetInfoStateType;
    isWifi: boolean;
}

export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>({
        isConnected: true,
        connectionType: NetInfoStateType.unknown,
        isWifi: false,
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setStatus({
                isConnected: !!state.isConnected,
                connectionType: state.type,
                isWifi: state.type === NetInfoStateType.wifi,
            });
        });

        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            setStatus({
                isConnected: !!state.isConnected,
                connectionType: state.type,
                isWifi: state.type === NetInfoStateType.wifi,
            });
        });

        return () => unsubscribe();
    }, []);

    return status;
}
