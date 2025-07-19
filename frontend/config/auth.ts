export const AUTH_CONFIG = {
  // Auth0 Configuration
  AUTH0_DOMAIN: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'dev-sap6daz2obvosbk4.ca.auth0.com',
  AUTH0_CLIENT_ID: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || '5bfZuXoxPdFBjfX2FYLX6Y6cIRTThLlH',
  
  // API Configuration
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:3000' 
    : process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-production-api.com',
    
  // App Configuration
  APP_SCHEME: 'HT6',
};

// Auth0 scopes
export const AUTH_SCOPES = ['openid', 'profile', 'email', 'offline_access'];

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth0_access_token',
  REFRESH_TOKEN: 'auth0_refresh_token',
  USER_INFO: 'auth0_user_info',
  ID_TOKEN: 'auth0_id_token',
};
