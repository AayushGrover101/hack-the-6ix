import express from 'express';
import connectDB from './config/database.js';
import User from './models/User.js';
import Group from './models/Group.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateDistance, isWithinRadius, direction } from './utils/proximity.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ["http://localhost:8081", "http://localhost:3000", "exp://localhost:8081", "https://hack-the-6ix.onrender.com", "*"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:8081", "http://localhost:3000", "exp://localhost:8081", "https://hack-the-6ix.onrender.com", "*"],
  credentials: true
}));

app.use(express.json());

// Hard-coded users
const HARDCODED_USERS = {
  '1': {
    uid: 'user1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  '2': {
    uid: 'user2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  '3': {
    uid: 'user3',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
};

// Simple authentication middleware using user ID in headers
const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || req.headers['user-id'];
    
    if (userId && HARDCODED_USERS[userId]) {
      req.user = HARDCODED_USERS[userId];
      req.isAuthenticated = true;
      console.log(`User authenticated: ${req.user.name} (${userId})`);
    } else {
      req.isAuthenticated = false;
      if (userId) {
        console.log(`Invalid user ID: ${userId}`);
      }
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.isAuthenticated = false;
    next();
  }
};

app.use(authenticateUser);

// Middleware to automatically create/update user in database
app.use(async (req, res, next) => {
  if (req.isAuthenticated && req.user) {
    try {
      const uid = req.user.uid;
      const email = req.user.email;
      const name = req.user.name;
      const profilePicture = req.user.profilePicture;
      
      // Check if user already exists by uid
      let user = await User.findOne({ uid });
      
      if (!user) {
        // Create new user
        user = new User({
          uid,
          email,
          name,
          profilePicture,
          location: null,
          groupId: null
        });
        
        await user.save();
        console.log(`Created hard-coded user: ${name} (${email})`);
      } else {
        // Update existing user if needed
        if (user.name !== name || user.email !== email || user.profilePicture !== profilePicture) {
          user.name = name;
          user.email = email;
          user.profilePicture = profilePicture;
          await user.save();
          console.log(`Updated hard-coded user: ${name} (${email})`);
        }
      }
    } catch (error) {
      console.error('Error in user creation middleware:', error);
    }
  }
  next();
});

// Get available users for login
app.get('/available-users', (req, res) => {
  const users = Object.values(HARDCODED_USERS).map(user => ({
    uid: user.uid,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture
  }));
  
  res.json({ users });
});

app.get('/', (req, res) => {
  res.send(req.isAuthenticated ? `Logged in as ${req.user.name}` : 'Not logged in');
});

app.post('/users', async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const uid = req.user.uid;
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please log in first.' });
    }
    
    res.json({ message: 'User retrieved successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/groups', async (req, res) => {
  try {
    const { name } = req.body;

    const uid = req.user.uid;
    
    if (!name || !uid) {
      return res.status(400).json({ error: 'Group name and user authentication are required' });
    }
    
    // Find the user in MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please create a user profile first.' });
    }
    
    const groupId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const group = new Group({
      groupId,
      name,
      users: [uid]
    });
    
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/groups/:groupId', async (req, res) => {
  try {
    const group = await Group.findOne({ groupId: req.params.groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/join-group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const uid = req.user.uid;
    
    if (!uid) {
      return res.status(400).json({ error: 'User authentication required' });
    }
    
    // Find the user in MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please create a user profile first.' });
    }
    
    // Check if user is already in a group
    if (user.groupId) {
      return res.status(400).json({ error: 'User is already in a group. Leave current group first.' });
    }
    
    // Check if group exists
    const group = await Group.findOne({ groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if user is already in the group
    if (group.users.includes(uid)) {
      return res.status(400).json({ error: 'User is already in this group' });
    }
    
    // Add user to the group
    group.users.push(uid);
    await group.save();
    
    // Update user's groupId
    user.groupId = groupId;
    await user.save();
    
    res.json({ group, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/leave-group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const uid = req.user.uid;
    
    if (!uid) {
      return res.status(400).json({ error: 'User authentication required' });
    }
    
    // Find the user in MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please create a user profile first.' });
    }
    
    // Check if user is in this group
    if (user.groupId !== groupId) {
      return res.status(400).json({ error: 'User is not in this group' });
    }
    
    // Check if group exists
    const group = await Group.findOne({ groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Remove user from the group
    group.users = group.users.filter(userId => userId !== uid);
    await group.save();
    
    // Update user's groupId to null
    user.groupId = null;
    await user.save();
    
    // If group has no users, delete it
    if (group.users.length === 0) {
      await Group.deleteOne({ groupId });
      res.json({ message: 'User left group and group was deleted (no users remaining)', user });
    } else {
      res.json({ message: 'User left group successfully', group, user });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/groups/:groupId/users', async (req, res) => {
  try {
    const { users } = req.body;
    const group = await Group.findOneAndUpdate(
      { groupId: req.params.groupId },
      { users },
      { new: true }
    );
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get group members with their locations
app.get('/groups/:groupId/members', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await Group.findOne({ groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Get all users in the group with their locations
    const members = await User.find({ 
      uid: { $in: group.users },
      location: { $exists: true, $ne: null }
    }).select('uid name location');

    res.json({ groupId, members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby users within a radius (in meters)
app.get('/users/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 1000 } = req.query; // Default 1km radius
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const nearbyUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).select('uid name location');

    res.json({ nearbyUsers, radius: parseInt(radius) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Boop endpoint - when two people boop each other
app.post('/boop', async (req, res) => {
  try {
    const { booperUid, boopeeUid, latitude, longitude } = req.body;
    
    if (!booperUid || !boopeeUid) {
      return res.status(400).json({ error: 'Both booper and boopee UIDs are required' });
    }

    // Find both users
    const booper = await User.findOne({ uid: booperUid });
    const boopee = await User.findOne({ uid: boopeeUid });

    if (!booper || !boopee) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Check if both users are in the same group
    if (!booper.groupId || !boopee.groupId || booper.groupId !== boopee.groupId) {
      return res.status(400).json({ error: 'Both users must be in the same group to boop' });
    }

    // Find the group
    const group = await Group.findOne({ groupId: booper.groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if users are within booping distance (e.g., 10 meters)
    if (booper.location && boopee.location && latitude && longitude) {
      const boopLocation = { latitude, longitude };
      const booperLocation = { 
        latitude: booper.location.coordinates[1], 
        longitude: booper.location.coordinates[0] 
      };
      const boopeeLocation = { 
        latitude: boopee.location.coordinates[1], 
        longitude: boopee.location.coordinates[0] 
      };

      const distanceToBooper = calculateDistance(boopLocation, booperLocation);
      const distanceToBoopee = calculateDistance(boopLocation, boopeeLocation);

      if (distanceToBooper > 10 || distanceToBoopee > 10) {
        return res.status(400).json({ error: 'Users must be within 10 meters to boop' });
      }
    }

    // Create boop log entry
    const boopEntry = {
      booper: booperUid,
      boopee: boopeeUid,
      timestamp: new Date(),
      location: latitude && longitude ? {
        type: 'Point',
        coordinates: [longitude, latitude]
      } : null
    };

    // Add to group's boop log
    group.boopLog.push(boopEntry);
    await group.save();

    // Emit real-time notification to group members via Socket.IO
    io.to(booper.groupId).emit('boop_happened', {
      booper: {
        uid: booper.uid,
        name: booper.name
      },
      boopee: {
        uid: boopee.uid,
        name: boopee.name
      },
      timestamp: boopEntry.timestamp,
      location: boopEntry.location
    });

    res.json({
      message: 'Boop successful!',
      boop: boopEntry,
      group: {
        groupId: group.groupId,
        name: group.name
      }
    });

  } catch (error) {
    console.error('Boop error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get boop log for a group
app.get('/groups/:groupId/boop-log', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await Group.findOne({ groupId });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Get user details for each boop entry
    const boopLogWithUsers = await Promise.all(
      group.boopLog.map(async (boop) => {
        const booper = await User.findOne({ uid: boop.booper }).select('uid name');
        const boopee = await User.findOne({ uid: boop.boopee }).select('uid name');
        
        return {
          booper: booper || { uid: boop.booper, name: 'Unknown User' },
          boopee: boopee || { uid: boop.boopee, name: 'Unknown User' },
          timestamp: boop.timestamp,
          location: boop.location
        };
      })
    );

    res.json({
      groupId,
      groupName: group.name,
      boopLog: boopLogWithUsers
    });

  } catch (error) {
    console.error('Get boop log error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('update_location', async (data) => {
    try {
      const uid = data.uid;
      const latitude = data.latitude;
      const longitude = data.longitude;

      if (!uid || latitude === undefined || longitude === undefined) {
        socket.emit('location_update_error', { error: 'Invalid location data' });
        return;
      }

      const user = await User.findOne({ uid });
      if (!user) {
        socket.emit('location_update_error', { error: 'User not found' });
        return;
      }

      // Update location with proper MongoDB geospatial format
      user.location = {
        type: 'Point',
        coordinates: [longitude, latitude] // MongoDB expects [longitude, latitude]
      };
      
      await user.save();
      
      // Emit success with updated user data
      socket.emit('location_update_success', { 
        message: 'Location updated successfully', 
        user: {
          uid: user.uid,
          name: user.name,
          location: user.location,
          groupId: user.groupId
        }
      });

      // If user is in a group, notify other group members
      if (user.groupId) {
        socket.to(user.groupId).emit('member_location_updated', {
          uid: user.uid,
          name: user.name,
          location: user.location
        });
      }

    } catch (error) {
      console.error('Location update error:', error);
      socket.emit('location_update_error', { error: error.message });
    }
  });

  // Handle boop event via Socket.IO
  socket.on('boop', async (data) => {
    try {
      const { booperUid, boopeeUid, latitude, longitude } = data;
      
      if (!booperUid || !boopeeUid) {
        socket.emit('boop_error', { error: 'Both booper and boopee UIDs are required' });
        return;
      }

      // Find both users
      const booper = await User.findOne({ uid: booperUid });
      const boopee = await User.findOne({ uid: boopeeUid });

      if (!booper || !boopee) {
        socket.emit('boop_error', { error: 'One or both users not found' });
        return;
      }

      // Check if both users are in the same group
      if (!booper.groupId || !boopee.groupId || booper.groupId !== boopee.groupId) {
        socket.emit('boop_error', { error: 'Both users must be in the same group to boop' });
        return;
      }

      // Find the group
      const group = await Group.findOne({ groupId: booper.groupId });
      if (!group) {
        socket.emit('boop_error', { error: 'Group not found' });
        return;
      }

      // Check if users are within booping distance (e.g., 10 meters)
      if (booper.location && boopee.location && latitude && longitude) {
        const boopLocation = { latitude, longitude };
        const booperLocation = { 
          latitude: booper.location.coordinates[1], 
          longitude: booper.location.coordinates[0] 
        };
        const boopeeLocation = { 
          latitude: boopee.location.coordinates[1], 
          longitude: boopee.location.coordinates[0] 
        };

        const distanceToBooper = calculateDistance(boopLocation, booperLocation);
        const distanceToBoopee = calculateDistance(boopLocation, boopeeLocation);

        if (distanceToBooper > 10 || distanceToBoopee > 10) {
          socket.emit('boop_error', { error: 'Users must be within 10 meters to boop' });
          return;
        }
      }

      // Create boop log entry
      const boopEntry = {
        booper: booperUid,
        boopee: boopeeUid,
        timestamp: new Date(),
        location: latitude && longitude ? {
          type: 'Point',
          coordinates: [longitude, latitude]
        } : null
      };

      // Add to group's boop log
      group.boopLog.push(boopEntry);
      await group.save();

      // Emit real-time notification to group members
      io.to(booper.groupId).emit('boop_happened', {
        booper: {
          uid: booper.uid,
          name: booper.name
        },
        boopee: {
          uid: boopee.uid,
          name: boopee.name
        },
        timestamp: boopEntry.timestamp,
        location: boopEntry.location
      });

      // Send success response to the booper
      socket.emit('boop_success', {
        message: 'Boop successful!',
        boop: boopEntry,
        group: {
          groupId: group.groupId,
          name: group.name
        }
      });

    } catch (error) {
      console.error('Socket boop error:', error);
      socket.emit('boop_error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

