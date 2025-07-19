import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import { AUTH_CONFIG, AUTH_SCOPES, STORAGE_KEYS } from '../config/auth';

// Get the redirect URI
const redirectUri = AuthSession.makeRedirectUri({
  scheme: AUTH_CONFIG.APP_SCHEME,
  path: 'auth',
});

// Also create a fallback for development
const redirectUriFallback = Platform.select({
  native: `${AUTH_CONFIG.APP_SCHEME}://auth`,
  default: redirectUri,
});

console.log('Auth redirect URI:', redirectUri);
console.log('Fallback redirect URI:', redirectUriFallback);

interface User {
  uid: string;
  email: string;
  name: string;
  profilePicture?: string;
  location?: any;
  groupId?: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Auth0 discovery document
  const discovery = AuthSession.useAutoDiscovery(`https://${AUTH_CONFIG.AUTH0_DOMAIN}`);

  // Create Auth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.AUTH0_CLIENT_ID,
      scopes: AUTH_SCOPES,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      extraParams: {
        audience: `https://${AUTH_CONFIG.AUTH0_DOMAIN}/api/v2/`,
      },
    },
    discovery
  );

  // Check if user is already authenticated on app start
  const checkAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedAccessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      const storedUserInfo = await SecureStore.getItemAsync(STORAGE_KEYS.USER_INFO);
      
      if (storedAccessToken && storedUserInfo) {
        setAccessToken(storedAccessToken);
        setUser(JSON.parse(storedUserInfo));
        setIsAuthenticated(true);
        
        // Try to refresh user info from backend
        await fetchUserFromBackend(storedAccessToken);
      }
    } catch (error) {
      console.log('No stored credentials found:', error);
      // Clear any corrupted data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const exchangeCodeForTokens = useCallback(async (code: string) => {
    try {
      setIsLoading(true);
      
      // Exchange authorization code for tokens
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: AUTH_CONFIG.AUTH0_CLIENT_ID,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery!
      );

      if (tokenResult.accessToken) {
        // Store tokens securely
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenResult.accessToken);
        
        // Store refresh token if available
        if (tokenResult.refreshToken) {
          await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokenResult.refreshToken);
        }
        
        // Store ID token if available
        if (tokenResult.idToken) {
          await SecureStore.setItemAsync(STORAGE_KEYS.ID_TOKEN, tokenResult.idToken);
        }

        setAccessToken(tokenResult.accessToken);
        setIsAuthenticated(true);

        // Get user info from Auth0
        const userInfoResponse = await fetch(`https://${AUTH_CONFIG.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            Authorization: `Bearer ${tokenResult.accessToken}`,
          },
        });

        if (userInfoResponse.ok) {
          const auth0User = await userInfoResponse.json();
          
          // Create user object matching your backend schema
          const userData: User = {
            uid: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || auth0User.nickname || auth0User.email?.split('@')[0] || 'User',
            profilePicture: auth0User.picture,
          };

          // Store user info
          await SecureStore.setItemAsync(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
          setUser(userData);

          // Fetch updated user info from your backend
          await fetchUserFromBackend(tokenResult.accessToken);
        }
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [request, discovery]);

  // Handle the auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForTokens(code);
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);
      setIsLoading(false);
    }
  }, [response, exchangeCodeForTokens]);

  const fetchUserFromBackend = async (token: string) => {
    try {
      // Make API call to your backend to get/create user
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          await SecureStore.setItemAsync(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
        }
      } else {
        console.error('Failed to fetch user from backend:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user from backend:', error);
      // Don't throw error here - backend might not be available but auth should still work
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_INFO),
        SecureStore.deleteItemAsync(STORAGE_KEYS.ID_TOKEN),
      ]);
    } catch (error) {
      console.log('Error clearing auth data:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  };

  const login = async () => {
    try {
      setIsLoading(true);
      console.log('Starting login process...');
      await promptAsync();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (accessToken) {
      await fetchUserFromBackend(accessToken);
    }
  };

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
