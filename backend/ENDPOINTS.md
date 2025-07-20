# Backend API Endpoints - Complete Documentation

## 🔐 Authentication
All endpoints use header-based authentication with `x-user-id` or `user-id` header.

### Available Users:
- `1` - Alice Johnson (user1)
- `2` - Bob Smith (user2) 
- `3` - Charlie Brown (user3)

---

## 📋 REST API Endpoints

### 🔍 User Management

#### `GET /available-users`
**Description:** Get list of available users for login
**Headers:** None required
**Response:**
```json
{
  "users": [
    {
      "uid": "user1",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "profilePicture": "https://..."
    }
  ]
}
```

#### `GET /`
**Description:** Root endpoint - shows authentication status
**Headers:** `x-user-id`
**Response:** `"Logged in as Alice Johnson"` or `"Not logged in"`

#### `POST /users`
**Description:** Get current user data from database
**Headers:** `x-user-id` (required)
**Response:**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "uid": "user1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "location": {...},
    "groupId": "ABC123"
  }
}
```

#### `GET /users`
**Description:** Get all users (admin endpoint)
**Headers:** None required
**Response:** Array of all users

#### `GET /users/nearby`
**Description:** Get nearby users within radius
**Headers:** None required
**Query Parameters:**
- `latitude` (required) - Current latitude
- `longitude` (required) - Current longitude  
- `radius` (optional) - Search radius in meters (default: 1000)

**Response:**
```json
{
  "nearbyUsers": [
    {
      "uid": "user2",
      "name": "Bob Smith",
      "location": {...}
    }
  ],
  "radius": 1000
}
```

#### `GET /users/:uid`
**Description:** Get specific user by UID
**Headers:** None required
**Response:** User object or 404 error

---

### 👥 Group Management

#### `POST /groups`
**Description:** Create a new group
**Headers:** `x-user-id` (required)
**Body:**
```json
{
  "name": "My Group"
}
```
**Response:**
```json
{
  "group": {
    "groupId": "ABC123",
    "name": "My Group",
    "users": ["user1"]
  },
  "user": {
    "uid": "user1",
    "groupId": "ABC123"
  }
}
```

#### `GET /groups`
**Description:** Get all groups
**Headers:** None required
**Response:** Array of all groups

#### `GET /groups/:groupId`
**Description:** Get specific group by ID
**Headers:** None required
**Response:** Group object or 404 error

#### `POST /join-group/:groupId`
**Description:** Join an existing group
**Headers:** `x-user-id` (required)
**Response:**
```json
{
  "group": {
    "groupId": "ABC123",
    "name": "My Group",
    "users": ["user1", "user2"]
  },
  "user": {
    "uid": "user2",
    "groupId": "ABC123"
  }
}
```

#### `POST /leave-group/:groupId`
**Description:** Leave a group
**Headers:** `x-user-id` (required)
**Response:**
```json
{
  "message": "User left group successfully",
  "group": {...},
  "user": {
    "uid": "user2",
    "groupId": null
  }
}
```

#### `PUT /groups/:groupId/users`
**Description:** Update group members (admin)
**Headers:** None required
**Body:**
```json
{
  "users": ["user1", "user2", "user3"]
}
```
**Response:** Updated group object

#### `GET /groups/:groupId/members`
**Description:** Get group members with locations
**Headers:** None required
**Response:**
```json
{
  "groupId": "ABC123",
  "members": [
    {
      "uid": "user1",
      "name": "Alice Johnson",
      "location": {...}
    }
  ]
}
```

---

### 🤝 Boop System

#### `POST /boop`
**Description:** Manual boop (legacy - now automatic)
**Headers:** `x-user-id` (required)
**Body:**
```json
{
  "booperUid": "user1",
  "boopeeUid": "user2",
  "latitude": 43.6532,
  "longitude": -79.3832
}
```
**Response:**
```json
{
  "message": "Boop successful!",
  "boop": {
    "booper": "user1",
    "boopee": "user2",
    "timestamp": "2024-01-01T12:00:00Z",
    "location": {...}
  },
  "group": {
    "groupId": "ABC123",
    "name": "My Group"
  }
}
```

#### `GET /groups/:groupId/boop-log`
**Description:** Get boop history for a group
**Headers:** None required
**Response:**
```json
{
  "groupId": "ABC123",
  "groupName": "My Group",
  "boopLog": [
    {
      "booper": {
        "uid": "user1",
        "name": "Alice Johnson"
      },
      "boopee": {
        "uid": "user2", 
        "name": "Bob Smith"
      },
      "timestamp": "2024-01-01T12:00:00Z",
      "location": {...}
    }
  ]
}
```

---

## 🔌 WebSocket Events

### 📡 Client → Server Events

#### `refresh_user`
**Description:** Refresh user data from database
**Data:**
```json
{
  "uid": "user1"
}
```

#### `update_location`
**Description:** Update user's location
**Data:**
```json
{
  "uid": "user1",
  "latitude": 43.6532,
  "longitude": -79.3832
}
```

---

### 📡 Server → Client Events

#### `connect`
**Description:** Socket connection established
**Data:** None

#### `disconnect`
**Description:** Socket disconnected
**Data:** None

#### `location_update_success`
**Description:** Location update successful
**Data:**
```json
{
  "message": "Location updated successfully",
  "user": {
    "uid": "user1",
    "name": "Alice Johnson",
    "location": {...},
    "groupId": "ABC123"
  }
}
```

#### `location_update_error`
**Description:** Location update failed
**Data:**
```json
{
  "error": "User not found"
}
```

#### `user_refreshed`
**Description:** User data refreshed
**Data:**
```json
{
  "user": {
    "uid": "user1",
    "name": "Alice Johnson",
    "location": {...},
    "groupId": "ABC123"
  }
}
```

#### `user_refresh_error`
**Description:** User refresh failed
**Data:**
```json
{
  "error": "User not found"
}
```

#### `proximity_alert`
**Description:** Nearby user detected
**Data:**
```json
{
  "nearbyUser": {
    "uid": "user2",
    "name": "Bob Smith",
    "location": {...}
  },
  "distance": 75.5,
  "canBoop": true
}
```

#### `boop_happened`
**Description:** Auto-boop occurred
**Data:**
```json
{
  "booper": {
    "uid": "user1",
    "name": "Alice Johnson"
  },
  "boopee": {
    "uid": "user2",
    "name": "Bob Smith"
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "location": {...},
  "distance": 8.2
}
```

#### `boop_success`
**Description:** Auto-boop successful
**Data:**
```json
{
  "message": "Auto-boop successful!",
  "boop": {...},
  "distance": 8.2
}
```

#### `member_location_updated`
**Description:** Group member moved
**Data:**
```json
{
  "uid": "user2",
  "name": "Bob Smith",
  "location": {...}
}
```

---

## 🎯 Missing Capabilities Analysis

### ✅ Fully Implemented:
- ✅ User authentication and management
- ✅ Group creation, joining, leaving
- ✅ Location tracking and updates
- ✅ Proximity detection (100m radius)
- ✅ Automatic booping (10m radius)
- ✅ Real-time WebSocket communication
- ✅ Boop history and logging
- ✅ Geospatial queries
- ✅ Error handling and validation

### 🔄 Partially Implemented:
- ⚠️ Friend system (model exists but no endpoints)
- ⚠️ Privacy settings (model exists but not used)
- ⚠️ Proximity settings (model exists but not used)
- ⚠️ Online status tracking (model exists but not implemented)

### ❌ Missing Features:
- ❌ User profile updates
- ❌ Friend requests and management
- ❌ Privacy controls for location sharing
- ❌ Custom proximity zones
- ❌ Push notifications
- ❌ User blocking/reporting
- ❌ Group chat functionality
- ❌ User search functionality
- ❌ Analytics and metrics
- ❌ Rate limiting
- ❌ User activity logs

---

## 🚀 Recommended Enhancements

### High Priority:
1. **User Profile Management** - Allow users to update their profiles
2. **Friend System** - Implement friend requests and friend-only boops
3. **Privacy Controls** - Allow users to control who can see their location
4. **Push Notifications** - Server-side notification delivery

### Medium Priority:
1. **Custom Proximity Zones** - Let users set their own boop distances
2. **User Search** - Find users by name or email
3. **Activity Logs** - Track user interactions
4. **Rate Limiting** - Prevent spam and abuse

### Low Priority:
1. **Group Chat** - Text messaging within groups
2. **Analytics** - Usage statistics and insights
3. **User Blocking** - Block unwanted users
4. **Advanced Privacy** - Time-based location sharing

---

## 🧪 Testing Commands

### Test REST Endpoints:
```bash
# Get available users
curl http://localhost:3000/available-users

# Get nearby users
curl "http://localhost:3000/users/nearby?latitude=43.6532&longitude=-79.3832&radius=100"

# Create group
curl -X POST http://localhost:3000/groups \
  -H "x-user-id: 1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Group"}'

# Get boop log
curl http://localhost:3000/groups/ABC123/boop-log
```

### Test WebSocket:
```bash
# Use the test client
node test-sockets.js

# Or use the web client
open web-client-example.html
```

---

## 📊 Database Schema

### User Model:
- `uid` (String, unique) - User identifier
- `name` (String) - Display name
- `email` (String, unique) - Email address
- `profilePicture` (String) - Profile image URL
- `location` (GeoJSON Point) - Current location
- `groupId` (String) - Current group membership
- `friends` ([String]) - Friend UIDs
- `friendRequests` ([Object]) - Pending friend requests
- `privacySettings` (Object) - Privacy preferences
- `proximitySettings` (Object) - Custom proximity zones
- `lastSeen` (Date) - Last activity timestamp
- `isOnline` (Boolean) - Online status

### Group Model:
- `groupId` (String, unique) - Group identifier
- `name` (String) - Group name
- `users` ([String]) - Member UIDs
- `boopLog` ([Object]) - Boop history

---

## 🔧 Configuration

### Environment Variables:
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Allowed CORS origins
- `MONGODB_URI` - Database connection string

### CORS Configuration:
- Origins: `["http://localhost:8081", "http://localhost:3000", "exp://localhost:8081", "https://hack-the-6ix.onrender.com", "null", "*"]`
- Methods: `["GET", "POST", "PUT", "DELETE", "OPTIONS"]`
- Headers: `["Content-Type", "x-user-id", "user-id"]`

---

## 🎯 Current System Capabilities

The backend currently provides a **fully functional automatic boop system** with:

1. **Real-time proximity detection** - Users within 100m get alerts
2. **Automatic booping** - Users within 10m automatically boop
3. **Group management** - Create, join, leave groups
4. **Location tracking** - Real-time GPS updates
5. **WebSocket communication** - Instant notifications
6. **Boop history** - Track all boop interactions
7. **Geospatial queries** - Efficient location-based searches
8. **Error handling** - Comprehensive error responses
9. **Authentication** - Header-based user identification
10. **CORS support** - Cross-origin request handling

The system is **production-ready** for the core boop functionality and can be extended with additional features as needed. 