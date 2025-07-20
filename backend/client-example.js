// Client Example for Automatic Boop System
// This shows how to integrate with the WebSocket backend

import { io } from 'socket.io-client';

class BoopClient {
  constructor(userId, userName) {
    this.userId = userId;
    this.userName = userName;
    this.socket = null;
    this.isConnected = false;
    this.currentLocation = null;
    this.nearbyUsers = new Map(); // Track nearby users
    this.boopHistory = []; // Track boop events
    
    // Event handlers
    this.onProximityAlert = null;
    this.onBoopHappened = null;
    this.onBoopSuccess = null;
    this.onLocationUpdate = null;
    this.onConnectionChange = null;
  }

  // Connect to the WebSocket server
  connect(serverUrl = 'http://localhost:3000') {
    console.log(`🔌 Connecting as ${this.userName}...`);
    
    this.socket = io(serverUrl, {
      extraHeaders: {
        'x-user-id': this.userId
      }
    });

    this.setupEventHandlers();
  }

  // Setup all WebSocket event handlers
  setupEventHandlers() {
    // Connection events
    this.socket.on('connect', () => {
      console.log(`✅ Connected as ${this.userName}`);
      this.isConnected = true;
      this.onConnectionChange?.(true);
      
      // Auto-refresh user data after connection
      setTimeout(() => {
        this.refreshUserData();
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      console.log(`❌ Disconnected from server`);
      this.isConnected = false;
      this.onConnectionChange?.(false);
    });

    // Location update events
    this.socket.on('location_update_success', (data) => {
      console.log(`📍 Location updated successfully`);
      this.onLocationUpdate?.(data);
    });

    this.socket.on('location_update_error', (data) => {
      console.error(`❌ Location update failed:`, data.error);
    });

    // User data events
    this.socket.on('user_refreshed', (data) => {
      console.log(`🔄 User data refreshed:`, data.user);
    });

    this.socket.on('user_refresh_error', (data) => {
      console.error(`❌ User refresh failed:`, data.error);
    });

    // Proximity detection events
    this.socket.on('proximity_alert', (data) => {
      const { nearbyUser, distance, canBoop } = data;
      
      // Update nearby users map
      this.nearbyUsers.set(nearbyUser.uid, {
        ...nearbyUser,
        distance,
        canBoop,
        lastSeen: new Date()
      });

      console.log(`🚨 PROXIMITY: ${nearbyUser.name} is ${distance.toFixed(1)}m away ${canBoop ? '🟢 CAN BOOP' : '🟡 Nearby'}`);
      
      // Call custom proximity handler
      this.onProximityAlert?.(data);
    });

    // Auto-boop events
    this.socket.on('boop_happened', (data) => {
      const { booper, boopee, timestamp, distance } = data;
      
      // Add to boop history
      this.boopHistory.push({
        booper,
        boopee,
        timestamp: new Date(timestamp),
        distance
      });

      console.log(`🤝 AUTO-BOOP: ${booper.name} and ${boopee.name} booped! (${distance.toFixed(1)}m apart)`);
      
      // Call custom boop handler
      this.onBoopHappened?.(data);
    });

    this.socket.on('boop_success', (data) => {
      console.log(`✅ AUTO-BOOP SUCCESS: ${data.message} (${data.distance.toFixed(1)}m)`);
      
      // Call custom success handler
      this.onBoopSuccess?.(data);
    });

    // Group member location updates (if using groups)
    this.socket.on('member_location_updated', (data) => {
      console.log(`📍 Group member moved: ${data.name}`);
    });
  }

  // Update user's location
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

  // Refresh user data from server
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

  // Get nearby users
  getNearbyUsers() {
    return Array.from(this.nearbyUsers.values());
  }

  // Get users within boop range (10m)
  getUsersInBoopRange() {
    return this.getNearbyUsers().filter(user => user.canBoop);
  }

  // Get boop history
  getBoopHistory() {
    return [...this.boopHistory];
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Disconnected from server');
    }
  }

  // Set custom event handlers
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

// Example usage for React Native / Mobile App
class MobileBoopApp {
  constructor() {
    this.client = null;
    this.watchId = null;
  }

  // Initialize the app with user credentials
  initialize(userId, userName) {
    this.client = new BoopClient(userId, userName);
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Connect to server
    this.client.connect();
  }

  setupEventHandlers() {
    // Handle proximity alerts
    this.client.setProximityHandler((data) => {
      this.handleProximityAlert(data);
    });

    // Handle boop events
    this.client.setBoopHandler((data) => {
      this.handleBoopHappened(data);
    });

    // Handle boop success
    this.client.setBoopSuccessHandler((data) => {
      this.handleBoopSuccess(data);
    });

    // Handle connection changes
    this.client.setConnectionChangeHandler((isConnected) => {
      this.handleConnectionChange(isConnected);
    });
  }

  // Start location tracking
  startLocationTracking() {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.client.updateLocation(latitude, longitude);
      },
      (error) => {
        console.error('Location error:', error);
      },
      options
    );
  }

  // Stop location tracking
  stopLocationTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Handle proximity alerts
  handleProximityAlert(data) {
    const { nearbyUser, distance, canBoop } = data;
    
    // Show notification to user
    this.showNotification(
      canBoop ? '🤝 Boop Available!' : '🚨 Someone Nearby',
      `${nearbyUser.name} is ${distance.toFixed(1)}m away`
    );

    // Update UI with nearby user
    this.updateNearbyUsersUI();
  }

  // Handle boop events
  handleBoopHappened(data) {
    const { booper, boopee, distance } = data;
    
    // Show boop notification
    this.showNotification(
      '🤝 Boop!',
      `${booper.name} and ${boopee.name} just booped!`
    );

    // Play haptic feedback
    this.playHapticFeedback();
    
    // Update UI
    this.updateBoopHistoryUI();
  }

  // Handle boop success
  handleBoopSuccess(data) {
    // Show success message
    this.showSuccessMessage('Auto-boop successful!');
  }

  // Handle connection changes
  handleConnectionChange(isConnected) {
    if (isConnected) {
      this.showSuccessMessage('Connected to server');
      this.startLocationTracking();
    } else {
      this.showErrorMessage('Disconnected from server');
      this.stopLocationTracking();
    }
  }

  // UI update methods (implement based on your UI framework)
  updateNearbyUsersUI() {
    const nearbyUsers = this.client.getNearbyUsers();
    const boopRangeUsers = this.client.getUsersInBoopRange();
    
    console.log('Nearby users:', nearbyUsers.length);
    console.log('Users in boop range:', boopRangeUsers.length);
    
    // Update your UI components here
    // Example: React state update, DOM manipulation, etc.
  }

  updateBoopHistoryUI() {
    const boopHistory = this.client.getBoopHistory();
    console.log('Boop history:', boopHistory);
    
    // Update your UI components here
  }

  // Notification methods (implement based on your platform)
  showNotification(title, message) {
    console.log(`📱 ${title}: ${message}`);
    // Implement platform-specific notifications
    // React Native: PushNotificationIOS, react-native-push-notification
    // Web: Notification API
    // Mobile: Native notification APIs
  }

  showSuccessMessage(message) {
    console.log(`✅ ${message}`);
    // Update UI with success message
  }

  showErrorMessage(message) {
    console.log(`❌ ${message}`);
    // Update UI with error message
  }

  playHapticFeedback() {
    console.log('📳 Playing haptic feedback');
    // Implement platform-specific haptic feedback
    // React Native: react-native-haptic-feedback
    // Web: navigator.vibrate
  }

  // Cleanup
  cleanup() {
    this.stopLocationTracking();
    this.client?.disconnect();
  }
}

// Example usage
function exampleUsage() {
  // Create mobile app instance
  const app = new MobileBoopApp();
  
  // Initialize with user data
  app.initialize('1', 'Alice Johnson');
  
  // The app will automatically:
  // 1. Connect to WebSocket server
  // 2. Start location tracking
  // 3. Send location updates
  // 4. Receive proximity alerts
  // 5. Handle automatic boops
  // 6. Update UI accordingly
  
  // Cleanup when app closes
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });
}

// Export for use in other modules
export { BoopClient, MobileBoopApp };
export default MobileBoopApp; 