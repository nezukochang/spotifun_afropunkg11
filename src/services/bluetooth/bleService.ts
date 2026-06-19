import { BleManager, Device } from 'react-native-ble-plx';
import { supabase } from '../supabase/client';
import { HandoffPayload } from '../../types';
import { BLE_HANDOFF_SERVICE_UUID, BLE_HANDOFF_CHAR_UUID, BLE_DEVICE_NAME_PREFIX } from '../../config';

const manager = new BleManager();
let connectedDevice: Device | null = null;
let handoffCallback: ((payload: HandoffPayload) => void) | null = null;

export { BLE_HANDOFF_SERVICE_UUID as BLE_Handoff_Service_UUID };
export { BLE_HANDOFF_CHAR_UUID as BLE_Handoff_Char_UUID };

// ─── Scanning ────────────────────────────────────────────────
export const startScanning = (onDeviceFound: (device: Device) => void) => {
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            console.warn('BLE Scan Error:', error);
            return;
        }
        if (device && device.name?.startsWith(BLE_DEVICE_NAME_PREFIX)) {
            onDeviceFound(device);
        }
    });
};

export const stopScanning = () => manager.stopDeviceScan();

// ─── Connection ──────────────────────────────────────────────
export const connectToDevice = async (device: Device) => {
    try {
        connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();
        console.log('Connected to:', device.name);
        return true;
    } catch (e) {
        console.error('Connection failed:', e);
        return false;
    }
};

export const disconnectDevice = async () => {
    if (connectedDevice) {
        try {
            await connectedDevice.cancelConnection();
        } catch (e) {
            console.warn('Disconnect error:', e);
        }
        connectedDevice = null;
    }
};

// ─── Session token ───────────────────────────────────────────
async function getSessionToken(): Promise<string | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    } catch {
        return null;
    }
}

async function getDeviceId(): Promise<string> {
    // Use a simple device identifier (in production, use a UUID stored in AsyncStorage)
    return `spotifun-afropunk-${Date.now()}`;
}

// ─── Send handoff ────────────────────────────────────────────
export const sendHandoff = async (trackId: string, positionMs: number): Promise<boolean> => {
    if (!connectedDevice) { return false; }

    const sessionToken = await getSessionToken();
    if (!sessionToken) {
        console.warn('sendHandoff: No session token available');
        return false;
    }

    const payload: HandoffPayload = {
        sessionToken,
        trackId,
        positionMs,
        timestamp: Date.now(),
        senderDeviceId: await getDeviceId(),
    };

    try {
        const encoded = btoa(JSON.stringify(payload));
        // BLE has MTU limits (~512 bytes). Split if needed.
        const CHUNK_SIZE = 180; // safe GATT write size
        const chunks: string[] = [];
        for (let i = 0; i < encoded.length; i += CHUNK_SIZE) {
            chunks.push(encoded.slice(i, i + CHUNK_SIZE));
        }

        for (const chunk of chunks) {
            await connectedDevice.writeCharacteristicWithResponseForService(
                BLE_HANDOFF_SERVICE_UUID,
                BLE_HANDOFF_CHAR_UUID,
                chunk
            );
        }
        return true;
    } catch (e) {
        console.error('Handoff write failed:', e);
        return false;
    }
};

// ─── Receive handoff ─────────────────────────────────────────
export const onReceiveHandoff = (callback: (payload: HandoffPayload) => void) => {
    handoffCallback = callback;
};

export const startListeningForHandoff = async () => {
    if (!connectedDevice) { return; }

    try {
        connectedDevice.monitorCharacteristicForService(
            BLE_HANDOFF_SERVICE_UUID,
            BLE_HANDOFF_CHAR_UUID,
            (error, characteristic) => {
                if (error) {
                    console.warn('Monitor error:', error);
                    return;
                }
                if (characteristic?.value && handoffCallback) {
                    try {
                        const decoded = JSON.parse(atob(characteristic.value)) as HandoffPayload;
                        handoffCallback(decoded);
                    } catch (e) {
                        console.warn('Handoff parse failed:', e);
                    }
                }
            }
        );
    } catch (e) {
        console.warn('startListeningForHandoff failed:', e);
    }
};

// ─── Validate session via Supabase ──────────────────────────
export const validateHandoffSession = async (sessionToken: string): Promise<boolean> => {
    try {
        // Use the token to make a simple auth check
        const { data, error } = await supabase.auth.getUser(sessionToken);
        return !error && !!data?.user;
    } catch {
        return false;
    }
};
