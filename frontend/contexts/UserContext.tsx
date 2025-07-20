import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
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
    timestamp: Date;
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
  lastSeen: Date;
  isOnline: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  switchUser: (uid: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Hardcoded users for development
const HARDCODED_USERS: Record<string, User> = {
  user1: {
    uid: 'user1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    profilePicture: null,
    location: {
      type: 'Point',
      coordinates: [-79.3832, 43.6532] // Toronto coordinates
    },
    groupId: null,
    friends: [],
    friendRequests: [],
    privacySettings: {
      shareLocation: true,
      showToFriends: true,
      showToEveryone: false,
      proximityAlerts: true
    },
    proximitySettings: {
      hotZone: 50,
      warmZone: 200,
      coldZone: 1000
    },
    lastSeen: new Date(),
    isOnline: true
  },
  user2: {
    uid: 'user2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    profilePicture: null,
    location: {
      type: 'Point',
      coordinates: [-79.3840, 43.6540] // Slightly different Toronto coordinates
    },
    groupId: null,
    friends: [],
    friendRequests: [],
    privacySettings: {
      shareLocation: true,
      showToFriends: true,
      showToEveryone: false,
      proximityAlerts: true
    },
    proximitySettings: {
      hotZone: 50,
      warmZone: 200,
      coldZone: 1000
    },
    lastSeen: new Date(),
    isOnline: true
  },
  user3: {
    uid: 'user3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    profilePicture: null,
    location: {
      type: 'Point',
      coordinates: [-79.3850, 43.6550] // Slightly different Toronto coordinates
    },
    groupId: null,
    friends: [],
    friendRequests: [],
    privacySettings: {
      shareLocation: true,
      showToFriends: true,
      showToEveryone: false,
      proximityAlerts: true
    },
    proximitySettings: {
      hotZone: 50,
      warmZone: 200,
      coldZone: 1000
    },
    lastSeen: new Date(),
    isOnline: true
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      // For development, use hardcoded users
      const hardcodedUser = HARDCODED_USERS[uid as keyof typeof HARDCODED_USERS];
      if (hardcodedUser) {
        setUser(hardcodedUser);
        setLoading(false);
        return;
      }

      // In production, this would fetch from your API
      // const response = await fetch(`YOUR_API_BASE_URL/users/${uid}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch user');
      // }
      // const userData = await response.json();
      // setUser(userData);
      
      throw new Error('User not found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.uid) {
      await fetchUser(user.uid);
    }
  };

  const switchUser = async (uid: string) => {
    await fetchUser(uid);
  };

  useEffect(() => {
    // For now, always load Alice (user1) as the default user
    fetchUser('user1');
  }, []);

  const contextValue: UserContextType = {
    user,
    loading,
    error,
    setUser,
    refreshUser,
    switchUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Helper function to get user by uid (for finding nearby users, etc.)
export const getUserById = (uid: string): User | null => {
  return HARDCODED_USERS[uid] || null;
};
