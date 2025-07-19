# React Native Auth0 Integration Guide

## Overview

This guide explains how to integrate React Native with the existing Auth0 backend. The backend now supports both web-based OAuth flows and JWT token-based authentication for mobile apps.

## 🔧 Backend Changes Made

### 1. Dual Authentication System
- **Web**: Traditional OAuth redirect flow (existing)
- **React Native**: JWT token-based authentication (new)

### 2. How It Works
The backend detects the request type:
- **React Native**: Sends `Authorization: Bearer <token>` header
- **Web**: Uses OAuth redirects (no Authorization header)

## 📱 React Native Implementation

### 1. Install Dependencies

```bash
npm install react-native-auth0
# or
yarn add react-native-auth0
```

### 2. Auth0 Configuration

Create an Auth0 application in your Auth0 dashboard:
- **Application Type**: Native
- **Allowed Callback URLs**: `com.yourapp://dev-sap6daz2obvosbk4.ca.auth0.com/ios/com.yourapp/callback`
- **Allowed Logout URLs**: `com.yourapp://dev-sap6daz2obvosbk4.ca.auth0.com/ios/com.yourapp/callback`

### 3. React Native Auth0 Setup

```typescript
// auth0-config.ts
export const auth0Config = {
  domain: 'dev-sap6daz2obvosbk4.ca.auth0.com',
  clientId: 'YOUR_CLIENT_ID',
  audience: 'https://your-api-identifier', // Same as backend AUTH0_AUDIENCE
  scope: 'openid profile email',
  redirectUri: 'com.yourapp://dev-sap6daz2obvosbk4.ca.auth0.com/ios/com.yourapp/callback'
};
```

### 4. Authentication Service

```typescript
// services/authService.ts
import Auth0 from 'react-native-auth0';
import { auth0Config } from '../auth0-config';

const auth0 = new Auth0(auth0Config);

export class AuthService {
  private accessToken: string | null = null;
  private user: any = null;

  async login(): Promise<boolean> {
    try {
      // This opens the native Auth0 login (NOT a web redirect)
      const credentials = await auth0.webAuth.authorize({
        scope: auth0Config.scope,
        audience: auth0Config.audience
      });
      
      this.accessToken = credentials.accessToken;
      this.user = credentials.user;
      
      // Store token securely
      await this.storeToken(credentials.accessToken);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await auth0.webAuth.clearSession();
      this.accessToken = null;
      this.user = null;
      await this.removeToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      this.accessToken = await this.retrieveToken();
    }
    return this.accessToken;
  }

  async getUser(): Promise<any> {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Secure token storage (implement with react-native-keychain or similar)
  private async storeToken(token: string): Promise<void> {
    // Implement secure storage
  }

  private async retrieveToken(): Promise<string | null> {
    // Implement secure retrieval
    return null;
  }

  private async removeToken(): Promise<void> {
    // Implement secure removal
  }
}

export const authService = new AuthService();
```

### 5. API Service with Authentication

```typescript
// services/apiService.ts
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:3000'; // Your backend URL

export class ApiService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await authService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: await this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    return response.json();
  }

  async createGroup(name: string) {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create group');
    }
    
    return response.json();
  }

  async joinGroup(groupId: string) {
    const response = await fetch(`${API_BASE_URL}/join-group/${groupId}`, {
      method: 'POST',
      headers: await this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to join group');
    }
    
    return response.json();
  }

  async getNearbyUsers(latitude: number, longitude: number, radius: number = 1000) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString()
    });
    
    const response = await fetch(`${API_BASE_URL}/users/nearby?${params}`, {
      headers: await this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get nearby users');
    }
    
    return response.json();
  }

  async boop(boopeeUid: string, latitude: number, longitude: number) {
    const user = await authService.getUser();
    
    const response = await fetch(`${API_BASE_URL}/boop`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({
        booperUid: user.sub,
        boopeeUid,
        latitude,
        longitude
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to boop');
    }
    
    return response.json();
  }
}

export const apiService = new ApiService();
```

### 6. React Native App Integration

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { authService } from './services/authService';
import { apiService } from './services/apiService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await apiService.getCurrentUser();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const success = await authService.login();
      if (success) {
        setIsAuthenticated(true);
        const userData = await apiService.getCurrentUser();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isAuthenticated ? (
        <Button title="Login" onPress={handleLogin} />
      ) : (
        <View>
          <Text>Welcome, {user?.name}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
}
```

## 🔐 Environment Variables

Add these to your backend `.env` file:

```env
# Existing variables
AUTH0_ISSUER_BASE_URL=https://dev-sap6daz2obvosbk4.ca.auth0.com
CLIENT_ID=your_client_id
SECRET=your_secret

# New variables for React Native
AUTH0_AUDIENCE=https://your-api-identifier
```

## 📋 Key Differences from Web Flow

1. **No Web Redirects**: React Native uses native authentication flows
2. **JWT Tokens**: Direct token exchange instead of session-based auth
3. **Secure Storage**: Tokens stored securely on device
4. **API Headers**: Authorization header with Bearer token
5. **Token Refresh**: Handle token expiration and refresh

## 🚀 Benefits of This Approach

- **Unified Backend**: Same API endpoints work for web and mobile
- **Secure**: JWT tokens with proper verification
- **Scalable**: Easy to add more mobile platforms
- **Maintainable**: Single source of truth for authentication logic

## 🔧 Additional Considerations

1. **Token Refresh**: Implement automatic token refresh
2. **Offline Support**: Handle authentication when offline
3. **Biometric Auth**: Add biometric authentication for enhanced security
4. **Deep Linking**: Configure deep links for Auth0 callbacks
5. **Error Handling**: Robust error handling for network issues

## ⚠️ Important Notes

- **React Native Auth0** uses native authentication flows, NOT web redirects
- The `auth0.webAuth.authorize()` method opens a native login screen
- No web browser is involved in the authentication process
- Tokens are exchanged directly between the app and Auth0

This setup allows your React Native app to seamlessly integrate with the existing backend while maintaining security and providing a smooth user experience. 