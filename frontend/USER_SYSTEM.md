# User System Implementation

This document explains the user system implementation for the hack-the-6ix project.

## Overview

The user system is implemented using React Context to provide user data throughout the app. Currently, it uses hardcoded users for development, but includes an API service ready for backend integration.

## Files

### 1. `contexts/UserContext.tsx`
- **UserProvider**: React context provider that manages user state
- **useUser**: Custom hook to access user data
- **getUserById**: Helper function to get any user by their UID
- **switchUser**: New method to dynamically change the current user

### 2. `services/userService.ts`
- API service for backend integration
- Methods for fetching users, nearby users, and booping
- Ready to use when connecting to the real backend

### 3. `app/_layout.tsx`
- Wraps the entire app with UserProvider
- Makes user context available throughout the app

### 4. `app/(tabs)/index.tsx` - **NEW USER SELECTION**
- Added user selection buttons with color-coded options
- Shows current selected user
- Elegant animated interface for switching between users
- Direct navigation to boopPage after user selection

## Current Users

The system currently has 3 hardcoded users for development:

1. **Alice Johnson** (user1) - *Blue theme (#4785EA)*
   - Email: alice@example.com
   - Location: Toronto coordinates
   
2. **Bob Smith** (user2) - *Red theme (#F06C6C)*
   - Email: bob@example.com
   - Location: Slightly offset Toronto coordinates
   
3. **Charlie Brown** (user3) - *Purple theme (#A76CF0)*
   - Email: charlie@example.com
   - Location: Different Toronto coordinates

## User Selection Features

### Index Page (Home Screen)
- **Color-coded buttons** for each user with their respective theme colors
- **Current user indicator** showing which user is currently selected
- **Smooth animations** integrated with existing design
- **Auto-navigation** to boopPage after user selection

### BoopPage Debug Features
- **Debug panel** showing current user and nearby user information
- **Quick switch button** to cycle through users for testing
- **Real-time updates** when user changes

## Usage in Components

```tsx
import { useUser, getUserById } from '@/contexts/UserContext';

function MyComponent() {
  // Get current user data and methods
  const { user, loading, error, switchUser } = useUser();
  
  // Switch to a different user
  const handleUserChange = async (uid: string) => {
    await switchUser(uid);
  };
  
  // Get any user by ID
  const otherUser = getUserById('user2');
  
  return (
    <View>
      {user && <Text>Current user: {user.name}</Text>}
      <Button onPress={() => handleUserChange('user2')}>
        Switch to Bob
      </Button>
    </View>
  );
}
```

## Integration with boopPage

The `boopPage.tsx` now:
- Uses `useUser()` to get the current user dynamically
- Updates profile and slider when user changes
- Shows debug information about current and nearby users
- Includes quick switch functionality for testing

## New User Switching Flow

1. **App Launch**: User starts on index page with Alice as default
2. **User Selection**: User can tap colored buttons to select Alice, Bob, or Charlie
3. **Visual Feedback**: Selected user is highlighted with white border
4. **Auto Navigation**: Automatically goes to boopPage after selection
5. **Dynamic Updates**: All UI updates to reflect the new user's data
6. **Debug Tools**: Quick switch available in boopPage for testing

## Backend API Integration

When ready to connect to the real backend:

1. Set the `EXPO_PUBLIC_API_URL` environment variable
2. Update the `UserContext.tsx` to use `userService` instead of hardcoded data
3. Implement authentication and JWT token management
4. The API endpoints are already implemented in the backend:
   - `GET /users` - Get all users
   - `GET /users/:uid` - Get user by ID
   - `GET /users/nearby` - Get nearby users
   - `POST /boop` - Boop interaction

## Available Backend Endpoints

Based on the backend code analysis:
- `GET /users` - List all users
- `GET /users/:uid` - Get specific user
- `GET /users/nearby?latitude=X&longitude=Y&radius=Z` - Find nearby users
- `POST /boop` - Perform boop action
- Group-related endpoints for future use

## Next Steps

1. **Distance Calculation**: Implement real distance calculation between users
2. **Real-time Updates**: Add WebSocket integration for live user locations
3. **Profile Pictures**: Add proper image handling for user avatars
4. **Backend Integration**: Connect to the real API when ready
5. **Persistent User Selection**: Save user selection in local storage
6. **Enhanced UI**: Add user avatars to selection buttons
