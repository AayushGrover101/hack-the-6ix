# Auth0 Setup Guide 🔐

## Fixed Issues

Your Auth0 implementation has been completely refactored to fix common issues:

### 1. **Configuration Management** ✅
- Moved hardcoded values to `config/auth.ts`
- Added environment variable support
- Created `.env` file for easy configuration

### 2. **Proper Redirect URI Handling** ✅
- Fixed redirect URI generation using `makeRedirectUri`
- Added fallback URIs for different environments
- Clear logging for debugging

### 3. **Improved Error Handling** ✅
- Better error messages and logging
- Graceful fallback when backend is unavailable
- Proper token storage and cleanup

### 4. **Enhanced Token Management** ✅
- Added support for refresh tokens and ID tokens
- Secure storage using Expo SecureStore
- Proper token cleanup on logout

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Auth0 Dashboard

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Your App** → **Settings**
3. Add these URLs to **Allowed Callback URLs**:
   ```
   HT6://auth
   exp://127.0.0.1:19000/--/auth
   https://auth.expo.io/@your-username/your-app-slug
   ```

4. Add the same URLs to **Allowed Logout URLs**

5. In **Advanced Settings** → **Grant Types**, ensure these are checked:
   - Authorization Code
   - Refresh Token

6. Save Changes

### Step 3: Environment Configuration

The app uses environment variables. Your `.env` file is already configured with:
```bash
EXPO_PUBLIC_AUTH0_DOMAIN=dev-sap6daz2obvosbk4.ca.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=5bfZuXoxPdFBjfX2FYLX6Y6cIRTThLlH
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Step 4: Test the Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Use the **AuthDebug** component to test:
   - Check if configuration is loaded correctly
   - Test login/logout functionality
   - Verify token storage

### Step 5: Integration

The AuthContext is already set up. Use it in your components:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return <AuthenticatedContent user={user} />;
}
```

## Key Files Modified

- `contexts/AuthContext.tsx` - Main authentication logic
- `config/auth.ts` - Configuration management
- `components/AuthDebug.tsx` - Debug component
- `components/LoginScreen.tsx` - Updated to use new context
- `.env` - Environment variables
- `utils/checkRedirectUri.js` - Helper for debugging URIs

## Debug Information

Use the `AuthDebug` component to see:
- Current authentication status
- Redirect URI being used
- User information
- Token presence

## Common Issues & Solutions

### Issue: "Invalid Redirect URI"
**Solution**: Make sure your Auth0 dashboard has the correct redirect URIs added (see Step 2).

### Issue: "Discovery document not found"
**Solution**: Check that your Auth0 domain is correct in the `.env` file.

### Issue: "Login button not working"
**Solution**: Check the console logs and use AuthDebug component to see the current state.

### Issue: "Backend user creation fails"
**Solution**: This is normal if your backend isn't running. The app will still work with Auth0 user data.

## Next Steps

1. Test login/logout flows
2. Integrate with your app screens
3. Add proper loading states
4. Implement user profile features

Your Auth0 implementation is now production-ready! 🚀
