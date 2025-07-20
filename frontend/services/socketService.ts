import { io, Socket } from 'socket.io-client';

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

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from Socket.IO server:', reason);
      });
    });
  }

  disconnect() {
    if (this.socket) {
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

  // Remove listeners
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
