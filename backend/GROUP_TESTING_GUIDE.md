# 🧪 Group Management Testing Guide

## 📋 Overview

The test script now includes comprehensive group management functionality to test all group-related endpoints and features.

---

## 🚀 Quick Start Testing

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Run the Test Script
```bash
node test-sockets.js
```

### 3. Basic Group Testing Flow
```bash
# Terminal 1 - Alice
1 1                    # Connect as Alice
4                      # Enter group management menu
1 My Test Group        # Create a group
# Note the group ID (e.g., ABC123)

# Terminal 2 - Bob  
1 2                    # Connect as Bob
4                      # Enter group management menu
2 ABC123               # Join Alice's group
2 43.6532 -79.3832     # Set location
2 43.65321 -79.38321   # Move closer (within 10m)
# Should see auto-boop!
```

---

## 📋 Group Management Commands

### Main Menu (Option 4)
Select `4` from the main menu to enter group management mode.

### Group Menu Options

#### 1. Create Group
```bash
1 <group_name>
```
**Example:**
```bash
1 My Awesome Group
```
**Response:**
```
🏗️ Creating group: My Awesome Group
✅ Group created: ABC123 - My Awesome Group
👥 Members: user1
```

#### 2. Join Group
```bash
2 <group_id>
```
**Example:**
```bash
2 ABC123
```
**Response:**
```
🤝 Joining group: ABC123
✅ Joined group: ABC123 - My Awesome Group
👥 Members: user1, user2
```

#### 3. Leave Group
```bash
3 <group_id>
```
**Example:**
```bash
3 ABC123
```
**Response:**
```
👋 Leaving group: ABC123
✅ Left group: User left group successfully
```

#### 4. Get Group Info
```bash
4 <group_id>
```
**Example:**
```bash
4 ABC123
```
**Response:**
```
📋 Getting group info: ABC123
📊 Group: ABC123 - My Awesome Group
👥 Members: user1, user2
📝 Boops: 3
```

#### 5. Get Group Stats
```bash
5 <group_id>
```
**Example:**
```bash
5 ABC123
```
**Response:**
```
📈 Getting group stats: ABC123
📊 Group Stats: My Awesome Group
👥 Total Members: 2
🟢 Online Members: 2
🤝 Total Boops: 3
📅 Recent Boops (24h): 2
```

#### 6. Get Group Members
```bash
6 <group_id>
```
**Example:**
```bash
6 ABC123
```
**Response:**
```
👥 Getting group members: ABC123
👥 Group Members (2):
  📍 Alice Johnson (user1)
  📍 Bob Smith (user2)
```

#### 7. Get Boop Log
```bash
7 <group_id>
```
**Example:**
```
7 ABC123
```
**Response:**
```
📝 Getting boop log: ABC123
📝 Boop Log for My Awesome Group (3 boops):
  1. Alice Johnson 🤝 Bob Smith at 2:30:45 PM
  2. Bob Smith 🤝 Alice Johnson at 2:31:12 PM
  3. Alice Johnson 🤝 Bob Smith at 2:32:03 PM
```

#### 8. Get All Groups
```bash
8
```
**Response:**
```
📋 Getting all groups
📋 All Groups (2):
  🏷️ ABC123 - My Awesome Group (2 members)
  🏷️ DEF456 - Another Group (1 members)
```

#### 9. Quick Group Test
```bash
9
```
**Response:**
```
🚀 Starting quick group test...
🏗️ Creating group: Test Group
✅ Group created: XYZ789 - Test Group
👥 Members: user1
✅ Quick test group created: XYZ789
💡 Other users can now join with: 2 XYZ789
```

#### 10. Get Current User Group
```bash
10
```
**Response:**
```
🔍 Getting current user's group
👥 Current user is in group: ABC123
```

#### 11. Back to Main Menu
```bash
11
```

---

## 🎯 Complete Testing Scenarios

### Scenario 1: Basic Group Creation and Joining
```bash
# Terminal 1 - Alice
1 1                    # Connect as Alice
4                      # Group management
1 My First Group       # Create group
# Note group ID (e.g., ABC123)

# Terminal 2 - Bob
1 2                    # Connect as Bob  
4                      # Group management
2 ABC123               # Join group
```

### Scenario 2: Auto-Boop Testing
```bash
# Terminal 1 - Alice
1 1                    # Connect as Alice
4                      # Group management
1 Boop Test Group      # Create group
# Note group ID

# Terminal 2 - Bob
1 2                    # Connect as Bob
4                      # Group management  
2 [GROUP_ID]           # Join same group
2 43.6532 -79.3832     # Set location
2 43.65321 -79.38321   # Move within 10m
# Should see auto-boop!
```

### Scenario 3: Group Analytics Testing
```bash
# After some boops happen...
4                      # Group management
5 [GROUP_ID]           # Get group stats
6 [GROUP_ID]           # Get group members
7 [GROUP_ID]           # Get boop log
```

### Scenario 4: Multi-User Group Testing
```bash
# Terminal 1 - Alice
1 1
4
1 Multi User Group

# Terminal 2 - Bob
1 2
4
2 [GROUP_ID]

# Terminal 3 - Charlie
1 3
4
2 [GROUP_ID]

# Check group info from any terminal
4
4 [GROUP_ID]
```

---

## 🔍 Testing Tips

### 1. Group ID Management
- Group IDs are 6-character alphanumeric codes (e.g., `ABC123`)
- They're generated automatically when creating groups
- Write down group IDs to share with other test users

### 2. Location Testing
- Use coordinates close to each other for proximity testing
- Base coordinates: `43.6532, -79.3832` (Toronto)
- Small changes (0.0001) = ~10m distance
- Medium changes (0.001) = ~100m distance

### 3. Auto-Boop Testing
- Users must be in the same group
- Users must be within 10m of each other
- Location updates trigger proximity detection
- Both users receive boop notifications

### 4. Error Handling
- Try joining non-existent groups
- Try leaving groups you're not in
- Try creating groups with invalid names
- Check error messages are clear

---

## 📊 Expected Behaviors

### ✅ Success Cases
- Group creation returns valid group ID
- Users can join existing groups
- Users can leave groups
- Group info shows correct member count
- Boop log tracks all interactions
- Auto-boop triggers when users are close

### ❌ Error Cases
- Cannot join non-existent group
- Cannot leave group you're not in
- Cannot create group without name
- Cannot join group if already in one
- Proper error messages displayed

---

## 🎯 Advanced Testing

### Multi-Terminal Testing
```bash
# Terminal 1: Alice (Group Creator)
1 1
4
1 Test Group

# Terminal 2: Bob (Joiner)
1 2  
4
2 [GROUP_ID]

# Terminal 3: Charlie (Joiner)
1 3
4
2 [GROUP_ID]

# All terminals can now test group features
```

### Location-Based Testing
```bash
# Set locations progressively closer
2 43.6532 -79.3832     # Base location
2 43.65321 -79.38321   # ~10m away (should trigger boop)
2 43.65322 -79.38322   # ~20m away (proximity alert only)
```

### Group Lifecycle Testing
```bash
# Create → Join → Use → Leave → Delete
1 My Test Group        # Create
2 [GROUP_ID]           # Join (from other terminal)
# Use group features
3 [GROUP_ID]           # Leave
# Group auto-deletes when empty
```

---

## 🚨 Troubleshooting

### Common Issues
1. **"User not found"** - Make sure users exist in database
2. **"Group not found"** - Check group ID is correct
3. **"Already in group"** - Leave current group first
4. **No auto-boop** - Check users are in same group and within 10m

### Debug Commands
```bash
7                      # Show current status
3                      # Refresh user data
10                     # Get current user group
8                      # List all groups
```

---

## 🎉 Success Indicators

You know the group system is working when:
- ✅ Groups can be created with unique IDs
- ✅ Users can join and leave groups
- ✅ Group info shows correct member lists
- ✅ Auto-boop triggers when users are close
- ✅ Boop log tracks all interactions
- ✅ Group stats show accurate analytics
- ✅ Error handling works properly

The group management system is now fully testable with comprehensive functionality! 🎯 