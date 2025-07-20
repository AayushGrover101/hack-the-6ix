import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';

interface User {
  uid: string;
  name: string;
  email: string;
  profilePicture: string;
}

interface TestResult {
  test: string;
  result: string;
  details: string;
  timestamp: string;
}

interface Group {
  groupId: string;
  name: string;
  users: string[];
}

export default function App() {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [backendResponse, setBackendResponse] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);

  const addTestResult = (test: string, result: string, details: string = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Load available users on app start
  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = async () => {
    addTestResult('Load Users', 'STARTING', 'Loading available users...');
    
    try {
      const response = await fetch('https://hack-the-6ix.onrender.com/available-users');
      
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data.users);
        addTestResult('Load Users', 'SUCCESS', `Loaded ${data.users.length} users`);
      } else {
        const errorText = await response.text();
        addTestResult('Load Users', 'FAILED', `HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Load Users', 'FAILED', errorMessage);
      // Fallback to hardcoded users if backend is down
      const fallbackUsers = [
        {
          uid: 'user1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
          uid: 'user2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          uid: 'user3',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      ];
      setAvailableUsers(fallbackUsers);
      addTestResult('Load Users', 'FALLBACK', 'Using fallback users (backend unavailable)');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    addTestResult('User Login', 'SUCCESS', `Logged in as ${user.name}`);
    Alert.alert('Success', `✅ Logged in as ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBackendResponse('');
    addTestResult('User Logout', 'SUCCESS', 'Logged out');
    Alert.alert('Success', '✅ Logged out!');
  };

  // Test all endpoints
  const testAllEndpoints = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    addTestResult('Full API Test', 'STARTING', `Testing all endpoints as ${currentUser.name}...`);
    
    const headers = {
      'Content-Type': 'application/json',
      'X-User-ID': currentUser.uid
    };

    // Test 1: GET / (health check)
    try {
      const healthResponse = await fetch('https://hack-the-6ix.onrender.com/', { headers });
      addTestResult('GET /', healthResponse.ok ? 'SUCCESS' : 'FAILED', 
        healthResponse.ok ? await healthResponse.text() : `HTTP ${healthResponse.status}`);
    } catch (error) {
      addTestResult('GET /', 'FAILED', 'Connection error');
    }

    // Test 2: POST /users (get current user)
    try {
      const userResponse = await fetch('https://hack-the-6ix.onrender.com/users', {
        method: 'POST',
        headers
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        addTestResult('POST /users', 'SUCCESS', `User: ${userData.user?.name}`);
      } else {
        addTestResult('POST /users', 'FAILED', `HTTP ${userResponse.status}`);
      }
    } catch (error) {
      addTestResult('POST /users', 'FAILED', 'Connection error');
    }

    // Test 3: GET /users (get all users)
    try {
      const allUsersResponse = await fetch('https://hack-the-6ix.onrender.com/users');
      if (allUsersResponse.ok) {
        const allUsersData = await allUsersResponse.json();
        addTestResult('GET /users', 'SUCCESS', `${allUsersData.length} users found`);
      } else {
        addTestResult('GET /users', 'FAILED', `HTTP ${allUsersResponse.status}`);
      }
    } catch (error) {
      addTestResult('GET /users', 'FAILED', 'Connection error');
    }

    // Test 4: POST /groups (create group)
    try {
      const groupResponse = await fetch('https://hack-the-6ix.onrender.com/groups', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: `Test Group by ${currentUser.name}` })
      });
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        setGroups(prev => [...prev, groupData]);
        addTestResult('POST /groups', 'SUCCESS', `Group created: ${groupData.name}`);
      } else {
        addTestResult('POST /groups', 'FAILED', `HTTP ${groupResponse.status}`);
      }
    } catch (error) {
      addTestResult('POST /groups', 'FAILED', 'Connection error');
    }

    // Test 5: GET /groups (get all groups)
    try {
      const allGroupsResponse = await fetch('https://hack-the-6ix.onrender.com/groups');
      if (allGroupsResponse.ok) {
        const allGroupsData = await allGroupsResponse.json();
        setGroups(allGroupsData);
        addTestResult('GET /groups', 'SUCCESS', `${allGroupsData.length} groups found`);
      } else {
        addTestResult('GET /groups', 'FAILED', `HTTP ${allGroupsResponse.status}`);
      }
    } catch (error) {
      addTestResult('GET /groups', 'FAILED', 'Connection error');
    }

    addTestResult('Full API Test', 'COMPLETED', 'All endpoints tested');
  };

  const testSpecificEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    addTestResult(`${method} ${endpoint}`, 'STARTING', `Testing ${method} ${endpoint}...`);
    
    try {
      const options: any = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': currentUser.uid
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`https://hack-the-6ix.onrender.com${endpoint}`, options);
      
      if (response.ok) {
        const data = await response.json();
        setBackendResponse(JSON.stringify(data, null, 2));
        addTestResult(`${method} ${endpoint}`, 'SUCCESS', 'Response received');
        Alert.alert('Success', `✅ ${method} ${endpoint} successful!`);
      } else {
        const errorText = await response.text();
        addTestResult(`${method} ${endpoint}`, 'FAILED', `HTTP ${response.status}: ${errorText}`);
        Alert.alert('Error', `❌ ${method} ${endpoint} failed: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult(`${method} ${endpoint}`, 'FAILED', errorMessage);
      Alert.alert('Error', `❌ ${method} ${endpoint} failed: ${errorMessage}`);
    }
  };

  const testBackendHealth = async () => {
    addTestResult('Backend Health', 'STARTING', 'Testing backend connectivity...');
    
    try {
      const response = await fetch('https://hack-the-6ix.onrender.com/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.text();
        addTestResult('Backend Health', 'SUCCESS', `Backend is running: ${data}`);
        Alert.alert('Backend Health', '✅ Backend is running successfully!');
      } else {
        addTestResult('Backend Health', 'FAILED', `HTTP ${response.status}: ${response.statusText}`);
        Alert.alert('Backend Health', `❌ Backend error: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addTestResult('Backend Health', 'FAILED', errorMessage);
      Alert.alert('Backend Health', `❌ Connection failed: ${errorMessage}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setBackendResponse('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Endpoint Tester</Text>
      <Text style={styles.subtitle}>Comprehensive API Testing with Hard-Coded Users</Text>
      
      {/* Current User Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User</Text>
        
        {currentUser ? (
          <View style={styles.userInfo}>
            <Image source={{ uri: currentUser.profilePicture }} style={styles.profilePicture} />
            <Text style={styles.userName}>✅ {currentUser.name}</Text>
            <Text style={styles.userEmail}>{currentUser.email}</Text>
            <Text style={styles.userId}>ID: {currentUser.uid}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginSection}>
            <Text style={styles.statusText}>Not logged in</Text>
            <Text style={styles.statusText}>Select a user below to login</Text>
          </View>
        )}
      </View>

      {/* Available Users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Users</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableUsers.map((user) => (
            <TouchableOpacity
              key={user.uid}
              style={[
                styles.userCard,
                currentUser?.uid === user.uid && styles.selectedUserCard
              ]}
              onPress={() => handleLogin(user)}
            >
              <Image source={{ uri: user.profilePicture }} style={styles.userCardPicture} />
              <Text style={styles.userCardName}>{user.name}</Text>
              <Text style={styles.userCardEmail}>{user.email}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* API Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Endpoint Tests</Text>
        
        <TouchableOpacity style={styles.button} onPress={testBackendHealth}>
          <Text style={styles.buttonText}>Test Backend Health</Text>
        </TouchableOpacity>
        
        {currentUser && (
          <>
            <TouchableOpacity style={styles.button} onPress={testAllEndpoints}>
              <Text style={styles.buttonText}>Test All Endpoints</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => testSpecificEndpoint('/users', 'POST')}
            >
              <Text style={styles.buttonText}>Test POST /users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => testSpecificEndpoint('/users', 'GET')}
            >
              <Text style={styles.buttonText}>Test GET /users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => testSpecificEndpoint('/groups', 'POST', { name: 'New Test Group' })}
            >
              <Text style={styles.buttonText}>Test POST /groups</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => testSpecificEndpoint('/groups', 'GET')}
            >
              <Text style={styles.buttonText}>Test GET /groups</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Groups Display */}
      {groups.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Groups ({groups.length})</Text>
          <ScrollView style={styles.groupsContainer}>
            {groups.map((group, index) => (
              <View key={index} style={styles.groupItem}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupId}>ID: {group.groupId}</Text>
                <Text style={styles.groupUsers}>{group.users.length} users</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Backend Response */}
      {backendResponse && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last API Response</Text>
          <ScrollView style={styles.responseContainer}>
            <Text style={styles.responseText}>{backendResponse}</Text>
          </ScrollView>
        </View>
      )}

      {/* Test Results */}
      <View style={styles.section}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <TouchableOpacity onPress={clearResults}>
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
                         result.result === 'FAILED' ? '#F44336' : 
                         result.result === 'COMPLETED' ? '#2196F3' : '#FF9800' }
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
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
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
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  loginSection: {
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    minWidth: 120,
  },
  selectedUserCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  userCardPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  userCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  userCardEmail: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  groupsContainer: {
    maxHeight: 150,
  },
  groupItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  groupId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  groupUsers: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  responseContainer: {
    maxHeight: 200,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
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