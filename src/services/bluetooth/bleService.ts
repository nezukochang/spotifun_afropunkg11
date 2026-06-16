import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();
let connectedDevice: Device | null = null;

export const BLE_Handoff_Service_UUID = 'F00D';
export const BLE_Handoff_Char_UUID = 'BEEF';

export const startScanning = (onDeviceFound: (device: Device) => void) => {
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            console.warn('BLE Scan Error:', error);
            return;
        }
        if (device && device.name?.startsWith('Fluxion')) {
            onDeviceFound(device);
        }
    });
};

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

export const sendHandoff = async (trackId: string, positionMs: number) => {
    if (!connectedDevice) { return false; }
    const payload = JSON.stringify({ trackId, positionMs, ts: Date.now() });
    try {
        await connectedDevice.writeCharacteristicWithResponseForService(
            BLE_Handoff_Service_UUID,
            BLE_Handoff_Char_UUID,
            btoa(payload)
        );
        return true;
    } catch (e) {
        console.error('Handoff write failed:', e);
        return false;
    }
};

export const stopScanning = () => manager.stopDeviceScan();
