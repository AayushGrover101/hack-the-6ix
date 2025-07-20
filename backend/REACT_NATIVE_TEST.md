# React Native Auth0 Testing Guide

## 🧪 **How to Test React Native Auth0 Integration**

### **Prerequisites**
- React Native development environment set up
- iOS Simulator or Android Emulator (or physical device)
- Auth0 account and application configured

## 📱 **Step 1: Create Test App**

```bash
# Create a new Expo app
npx create-expo-app HT6Test
cd HT6Test

# Install Auth0
npm install react-native-auth0

# Install additional dependencies
npm install expo-secure-store
```

## 🔧 **Step 2: Configure Auth0**

### **Auth0 Dashboard Setup:**
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new **Native Application**
3. Set **Allowed Callback URLs:**
   - iOS: `com.anonymous.HT6Test://dev-sap6daz2obvosbk4.ca.auth0.com/ios/com.anonymous.HT6Test/callback`
   - Android: `com.anonymous.HT6Test://dev-sap6daz2obvosbk4.ca.auth0.com/android/com.anonymous.HT6Test/callback`
4. Set **Allowed Logout URLs:** (same as callback URLs)
5. Enable **Google** social connection
6. Copy the **Client ID**

## 📝 **Step 3: Create Test App**

### **app.json Configuration:**
```json
{
  "expo": {
    "name": "HT6Test",
    "slug": "HT6Test",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "HT6Test",
    "ios": {
      "bundleIdentifier": "com.anonymous.HT6Test",
      "supportsTablet": true
    },
    "android": {
      "package": "com.anonymous.HT6Test",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### **App.js Test Code:**
```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import Auth0 from 'react-native-auth0';
import { Platform } from 'react-native';

const auth0 = new Auth0({
  domain: 'dev-sap6daz2obvosbk4.ca.auth0.com',
  clientId: 'YOUR_CLIENT_ID_HERE' // Replace with your actual Client ID
});

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testAuth0Login = async () => {
    setLoading(true);
    addTestResult('Auth0 Login', 'STARTING', 'Opening native login screen...');
    
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: 'https://your-api-identifier'
      });

      setUser(credentials.user);
      setToken(credentials.accessToken);
      
      addTestResult('Auth0 Login', 'SUCCESS', `User: ${credentials.user.name}`);
      Alert.alert('Success', `Logged in as ${credentials.user.name}`);
      
    } catch (error) {
      addTestResult('Auth0 Login', 'FAILED', error.message);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackendAPI = async () => {
    if (!token) {
      addTestResult('Backend API', 'FAILED', 'No token available');
      Alert.alert('Error', 'Please login first');
      return;
    }

    addTestResult('Backend API', 'STARTING', 'Testing API call...');
    
    try {
      const response = await fetch('https://hack-the-6ix.onrender.com/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult('Backend API', 'SUCCESS', `User data retrieved: ${data.user.name}`);
        Alert.alert('API Success', `Backend responded with user: ${data.user.name}`);
      } else {
        const errorText = await response.text();
        addTestResult('Backend API', 'FAILED', `HTTP ${response.status}: ${errorText}`);
        Alert.alert('API Error', `Status: ${response.status}`);
      }
    } catch (error) {
      addTestResult('Backend API', 'FAILED', error.message);
      Alert.alert('API Error', error.message);
    }
  };

  const testLogout = async () => {
    try {
      await auth0.webAuth.clearSession();
      setUser(null);
      setToken(null);
      addTestResult('Logout', 'SUCCESS', 'User logged out');
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      addTestResult('Logout', 'FAILED', error.message);
      Alert.alert('Logout Error', error.message);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HT6 Auth0 Test</Text>
      
      {/* Login Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        
        {!user ? (
          <TouchableOpacity
            style={styles.button}
            onPress={testAuth0Login}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login with Google'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Welcome, {user.name}!</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.button} onPress={testLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* API Testing Section */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend API Test</Text>
          <TouchableOpacity style={styles.button} onPress={testBackendAPI}>
            <Text style={styles.buttonText}>Test Backend API</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Test Results */}
      <View style={styles.section}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <TouchableOpacity onPress={clearTestResults}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.resultsContainer}>
          {testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultTest}>{result.test}</Text>
              <Text style={[
                styles.resultStatus,
                { color: result.result === 'SUCCESS' ? '#4CAF50' : 
                         result.result === 'FAILED' ? '#F44336' : '#FF9800' }
              ]}>
                {result.result}
              </Text>
              <Text style={styles.resultDetails}>{result.details}</Text>
              <Text style={styles.resultTime}>{result.timestamp}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    color: '#007AFF',
    fontSize: 14,
  },
  resultsContainer: {
    maxHeight: 200,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  resultTest: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  resultDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  resultTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});
```

## 🚀 **Step 4: Run the Test**

```bash
# Start the development server
npx expo start

# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Or scan QR code with Expo Go app on your phone
```

## 🧪 **What to Test**

### **1. Auth0 Login Flow**
- ✅ Click "Login with Google"
- ✅ Native Auth0 screen opens
- ✅ Google login option appears
- ✅ Can login with Google account
- ✅ Returns to app with user data

### **2. Backend API Integration**
- ✅ After login, click "Test Backend API"
- ✅ Should successfully call your backend
- ✅ Should return user data from database
- ✅ JWT token should be accepted

### **3. Logout Flow**
- ✅ Click "Logout"
- ✅ Should clear session
- ✅ Should return to login screen

## 📊 **Expected Test Results**

### **Successful Test:**
```
✅ Auth0 Login: SUCCESS - User: John Doe
✅ Backend API: SUCCESS - User data retrieved: John Doe
✅ Logout: SUCCESS - User logged out
```

### **Common Issues:**
```
❌ Auth0 Login: FAILED - Invalid redirect URI
❌ Backend API: FAILED - HTTP 401: Authentication required
❌ Auth0 Login: FAILED - Network error
```

## 🔧 **Troubleshooting**

### **If Auth0 Login Fails:**
1. Check callback URLs in Auth0 dashboard
2. Verify Client ID is correct
3. Ensure Google social connection is enabled
4. Check network connectivity

### **If Backend API Fails:**
1. Verify JWT token is being sent
2. Check backend is running at `https://hack-the-6ix.onrender.com`
3. Ensure Auth0 audience is configured correctly
4. Check CORS settings

## 📱 **Testing on Different Platforms**

### **iOS Simulator:**
- Use Safari View Controller
- Google login works with simulator
- Test Face ID/Touch ID if available

### **Android Emulator:**
- Use Chrome Custom Tabs
- Google login works with emulator
- Test fingerprint authentication if available

### **Physical Device:**
- Best for real-world testing
- Test actual Google account login
- Test biometric authentication

This test app will help you verify that your React Native Auth0 integration is working correctly with your backend! 🎉 