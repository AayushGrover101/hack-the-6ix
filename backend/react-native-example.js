// React Native Example for Automatic Boop System
// This shows how to integrate with React Native components

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import PushNotification from 'react-native-push-notification';
import { io } from 'socket.io-client';

// BoopClient class (same as before, but adapted for React Native)
class BoopClient {
  constructor(userId, userName) {
    this.userId = userId;
    this.userName = userName;
    this.socket = null;
    this.isConnected = false;
    this.currentLocation = null;
    this.nearbyUsers = new Map();
    this.boopHistory = [];
    
    // Event handlers
    this.onProximityAlert = null;
    this.onBoopHappened = null;
    this.onBoopSuccess = null;
    this.onLocationUpdate = null;
    this.onConnectionChange = null;
  }

  connect(serverUrl = 'http://localhost:3000') {
    console.log(`🔌 Connecting as ${this.userName}...`);
    
    this.socket = io(serverUrl, {
      extraHeaders: {
        'x-user-id': this.userId
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log(`✅ Connected as ${this.userName}`);
      this.isConnected = true;
      this.onConnectionChange?.(true);
      
      setTimeout(() => {
        this.refreshUserData();
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      console.log(`❌ Disconnected from server`);
      this.isConnected = false;
      this.onConnectionChange?.(false);
    });

    this.socket.on('location_update_success', (data) => {
      console.log(`📍 Location updated successfully`);
      this.onLocationUpdate?.(data);
    });

    this.socket.on('location_update_error', (data) => {
      console.error(`❌ Location update failed:`, data.error);
    });

    this.socket.on('user_refreshed', (data) => {
      console.log(`🔄 User data refreshed:`, data.user);
    });

    this.socket.on('user_refresh_error', (data) => {
      console.error(`❌ User refresh failed:`, data.error);
    });

    this.socket.on('proximity_alert', (data) => {
      const { nearbyUser, distance, canBoop } = data;
      
      this.nearbyUsers.set(nearbyUser.uid, {
        ...nearbyUser,
        distance,
        canBoop,
        lastSeen: new Date()
      });

      console.log(`🚨 PROXIMITY: ${nearbyUser.name} is ${distance.toFixed(1)}m away ${canBoop ? '🟢 CAN BOOP' : '🟡 Nearby'}`);
      
      this.onProximityAlert?.(data);
    });

    this.socket.on('boop_happened', (data) => {
      const { booper, boopee, timestamp, distance } = data;
      
      this.boopHistory.push({
        booper,
        boopee,
        timestamp: new Date(timestamp),
        distance
      });

      console.log(`🤝 AUTO-BOOP: ${booper.name} and ${boopee.name} booped! (${distance.toFixed(1)}m apart)`);
      
      this.onBoopHappened?.(data);
    });

    this.socket.on('boop_success', (data) => {
      console.log(`✅ AUTO-BOOP SUCCESS: ${data.message} (${data.distance.toFixed(1)}m)`);
      this.onBoopSuccess?.(data);
    });
  }

  updateLocation(latitude, longitude) {
    if (!this.isConnected) {
      console.error('❌ Not connected to server');
      return false;
    }

    this.currentLocation = { latitude, longitude };
    
    console.log(`📍 Updating location to: ${latitude}, ${longitude}`);
    
    this.socket.emit('update_location', {
      uid: this.userId,
      latitude,
      longitude
    });

    return true;
  }

  refreshUserData() {
    if (!this.isConnected) {
      console.error('❌ Not connected to server');
      return false;
    }

    console.log(`🔄 Refreshing user data...`);
    
    this.socket.emit('refresh_user', {
      uid: this.userId
    });

    return true;
  }

  getNearbyUsers() {
    return Array.from(this.nearbyUsers.values());
  }

  getUsersInBoopRange() {
    return this.getNearbyUsers().filter(user => user.canBoop);
  }

  getBoopHistory() {
    return [...this.boopHistory];
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Disconnected from server');
    }
  }

  // Event handler setters
  setProximityHandler(handler) {
    this.onProximityAlert = handler;
  }

  setBoopHandler(handler) {
    this.onBoopHappened = handler;
  }

  setBoopSuccessHandler(handler) {
    this.onBoopSuccess = handler;
  }

  setLocationUpdateHandler(handler) {
    this.onLocationUpdate = handler;
  }

  setConnectionChangeHandler(handler) {
    this.onConnectionChange = handler;
  }
}

// React Native Component
const BoopApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [boopHistory, setBoopHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  const clientRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    // Initialize the app
    initializeApp();
    
    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Request location permissions
      await requestLocationPermission();
      
      // Initialize client
      const client = new BoopClient('1', 'Alice Johnson');
      clientRef.current = client;
      
      // Set up event handlers
      setupEventHandlers(client);
      
      // Connect to server
      client.connect();
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Error', 'Failed to initialize app');
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to detect nearby users.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          throw new Error('Location permission denied');
        }
      } catch (err) {
        console.error('Location permission error:', err);
        throw err;
      }
    }
  };

  const setupEventHandlers = (client) => {
    // Connection change handler
    client.setConnectionChangeHandler((connected) => {
      setIsConnected(connected);
      if (connected) {
        startLocationTracking();
      } else {
        stopLocationTracking();
      }
    });

    // Proximity alert handler
    client.setProximityHandler((data) => {
      const { nearbyUser, distance, canBoop } = data;
      
      // Update nearby users state
      setNearbyUsers(client.getNearbyUsers());
      
      // Show notification
      showNotification(
        canBoop ? '🤝 Boop Available!' : '🚨 Someone Nearby',
        `${nearbyUser.name} is ${distance.toFixed(1)}m away`
      );
    });

    // Boop happened handler
    client.setBoopHandler((data) => {
      const { booper, boopee, distance } = data;
      
      // Update boop history
      setBoopHistory(client.getBoopHistory());
      
      // Show notification
      showNotification(
        '🤝 Boop!',
        `${booper.name} and ${boopee.name} just booped!`
      );
      
      // Play haptic feedback
      playHapticFeedback();
    });

    // Boop success handler
    client.setBoopSuccessHandler((data) => {
      showSuccessMessage('Auto-boop successful!');
    });

    // Location update handler
    client.setLocationUpdateHandler((data) => {
      setCurrentLocation(data.user.location);
    });
  };

  const startLocationTracking = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        clientRef.current?.updateLocation(latitude, longitude);
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Failed to get location');
      },
      options
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const showNotification = (title, message) => {
    // Local notification
    PushNotification.localNotification({
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
    });
  };

  const showSuccessMessage = (message) => {
    Alert.alert('Success', message);
  };

  const playHapticFeedback = () => {
    Vibration.vibrate(500);
  };

  const cleanup = () => {
    stopLocationTracking();
    clientRef.current?.disconnect();
  };

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={styles.statusBar}>
        <Text style={[styles.statusText, { color: isConnected ? '#4CAF50' : '#F44336' }]}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
      </View>

      {/* Current User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Alice Johnson</Text>
        <Text style={styles.userStatus}>
          {currentLocation ? '📍 Location Active' : '📍 Getting Location...'}
        </Text>
      </View>

      {/* Nearby Users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Users ({nearbyUsers.length})</Text>
        {nearbyUsers.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.distanceText}>
              {user.distance.toFixed(1)}m away
              {user.canBoop && ' 🟢 CAN BOOP'}
            </Text>
          </View>
        ))}
        {nearbyUsers.length === 0 && (
          <Text style={styles.emptyText}>No nearby users</Text>
        )}
      </View>

      {/* Boop History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Boops ({boopHistory.length})</Text>
        {boopHistory.slice(-5).map((boop, index) => (
          <View key={index} style={styles.boopCard}>
            <Text style={styles.boopText}>
              🤝 {boop.booper.name} & {boop.boopee.name}
            </Text>
            <Text style={styles.boopTime}>
              {boop.timestamp.toLocaleTimeString()} ({boop.distance.toFixed(1)}m)
            </Text>
          </View>
        ))}
        {boopHistory.length === 0 && (
          <Text style={styles.emptyText}>No boops yet</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  statusBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  boopCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  boopText: {
    fontSize: 14,
    fontWeight: '500',
  },
  boopTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default BoopApp; 