// API service for user-related operations
// This can be used when connecting to the real backend

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://hack-the-6ix.onrender.com';

export interface ApiUser {
  uid: string;
  name?: string;
  email: string;
  profilePicture?: string | null;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  groupId?: string | null;
  friends: string[];
  friendRequests: {
    from: string;
    status: 'pending' | 'accepted' | 'rejected';
    timestamp: string; // ISO string from API
  }[];
  privacySettings: {
    shareLocation: boolean;
    showToFriends: boolean;
    showToEveryone: boolean;
    proximityAlerts: boolean;
  };
  proximitySettings: {
    hotZone: number;
    warmZone: number;
    coldZone: number;
  };
  lastSeen: string; // ISO string from API
  isOnline: boolean;
}

class UserService {
  private getAuthHeaders() {
    // In a real app, you'd get the JWT token from your auth system
    return {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${getAuthToken()}`
    };
  }

  async getAllUsers(): Promise<ApiUser[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(uid: string): Promise<ApiUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${uid}:`, error);
      throw error;
    }
  }

  async getNearbyUsers(latitude: number, longitude: number, radius: number = 1000): Promise<ApiUser[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/users/nearby?${params}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.nearbyUsers;
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      throw error;
    }
  }

  async updateLocation(uid: string, latitude: number, longitude: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}/location`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async boopUser(booperUid: string, boopeeUid: string, latitude?: number, longitude?: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/boop`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          booperUid,
          boopeeUid,
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error booping user:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const userService = new UserService();

// Helper function to convert API user to app user format
export const convertApiUserToUser = (apiUser: ApiUser) => ({
  ...apiUser,
  lastSeen: new Date(apiUser.lastSeen),
  friendRequests: apiUser.friendRequests.map(req => ({
    ...req,
    timestamp: new Date(req.timestamp),
  })),
});
