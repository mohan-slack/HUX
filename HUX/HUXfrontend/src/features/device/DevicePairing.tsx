import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BleService, BleDevice, BleConnectionStatus } from '../../services/BleService';

const DevicePairing: React.FC = () => {
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [status, setStatus] = useState<BleConnectionStatus>('disconnected');
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);

  useEffect(() => {
    BleService.getInstance().onStatusChange(setStatus);
    BleService.getInstance().onDeviceFound((device) => {
      setDevices((prev) => {
        if (prev.find((d) => d.id === device.id)) return prev;
        return [...prev, device];
      });
    });
  }, []);

  const scan = async () => {
    setDevices([]);
    setStatus('scanning');
    await BleService.getInstance().scanForDevices();
    setStatus('disconnected');
  };

  const connect = async (deviceId: string) => {
    setConnectingId(deviceId);
    setStatus('connecting');
    const success = await BleService.getInstance().connectToDevice(deviceId);
    setConnectingId(null);
    if (success) {
      setConnectedId(deviceId);
      setStatus('connected');
    } else {
      setStatus('error');
    }
  };

  const disconnect = async () => {
    await BleService.getInstance().disconnect();
    setConnectedId(null);
    setStatus('disconnected');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pair Your HUX Smart Ring</Text>
      <TouchableOpacity style={styles.scanButton} onPress={scan} disabled={status === 'scanning'}>
        <Text style={styles.scanButtonText}>{status === 'scanning' ? 'Scanning...' : 'Scan for Devices'}</Text>
      </TouchableOpacity>
      {status === 'scanning' && <ActivityIndicator size="large" color="#2563EB" style={{ margin: 16 }} />}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.deviceCard, connectedId === item.id && styles.connectedCard]}
            onPress={() => connect(item.id)}
            disabled={status === 'connecting' || connectedId === item.id}
          >
            <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
            <Text style={styles.deviceId}>ID: {item.id}</Text>
            {item.rssi !== undefined && <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>}
            {connectedId === item.id && <Text style={styles.connectedText}>Connected</Text>}
            {connectingId === item.id && <ActivityIndicator size="small" color="#2563EB" />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No devices found. Tap scan to search.</Text>}
        style={{ marginTop: 16 }}
      />
      {connectedId && (
        <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.statusText}>Status: {status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  connectedCard: {
    borderColor: '#22C55E',
    borderWidth: 2,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  deviceId: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 2,
  },
  connectedText: {
    color: '#22C55E',
    fontWeight: 'bold',
    marginTop: 4,
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 32,
    fontSize: 14,
  },
});

export default DevicePairing; 