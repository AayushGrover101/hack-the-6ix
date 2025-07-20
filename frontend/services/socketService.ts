import { io, Socket } from 'socket.io-client';

interface NearbyUserData {
  uid: string;
  name: string;
  distance: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface LocationData {
  uid: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;

  constructor() {
    this.serverUrl = process.env.EXPO_PUBLIC_API_URL || 'https://hack-the-6ix.onrender.com';
  }

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      console.log('🔌 Connecting to Socket.IO server...');
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from Socket.IO server:', reason);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from Socket.IO server...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Location update methods
  updateLocation(uid: string, latitude: number, longitude: number) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('update_location', {
      uid,
      latitude,
      longitude
    });
  }

  // Join user-specific room for nearby user notifications
  joinUserRoom(uid: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('join_user_room', { uid });
  }

  // Leave user-specific room
  leaveUserRoom(uid: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('leave_user_room', { uid });
  }

  // Request nearby users
  requestNearbyUsers(uid: string, latitude: number, longitude: number, radius: number = 1000) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('request_nearby_users', {
      uid,
      latitude,
      longitude,
      radius
    });
  }

  // Event listeners
  onLocationUpdateSuccess(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('location_update_success', callback);
    }
  }

  onLocationUpdateError(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('location_update_error', callback);
    }
  }

  onNearbyUsersUpdate(callback: (data: { users: NearbyUserData[], radius: number }) => void) {
    if (this.socket) {
      this.socket.on('nearby_users_update', callback);
    }
  }

  onUserEnterRange(callback: (user: NearbyUserData) => void) {
    if (this.socket) {
      this.socket.on('user_enter_range', callback);
    }
  }

  onUserLeaveRange(callback: (user: { uid: string; name: string }) => void) {
    if (this.socket) {
      this.socket.on('user_leave_range', callback);
    }
  }

  onMemberLocationUpdated(callback: (data: LocationData) => void) {
    if (this.socket) {
      this.socket.on('member_location_updated', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.off('location_update_success');
      this.socket.off('location_update_error');
      this.socket.off('nearby_users_update');
      this.socket.off('user_enter_range');
      this.socket.off('user_leave_range');
      this.socket.off('member_location_updated');
    }
  }

  // Remove specific listeners (backward compatibility)
  removeLocationListeners() {
    if (this.socket) {
      this.socket.off('location_update_success');
      this.socket.off('location_update_error');
    }
  }

  // Get socket instance for custom events
  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const socketService = new SocketService();
