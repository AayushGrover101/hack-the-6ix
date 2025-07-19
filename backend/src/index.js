import express from 'express';
import { auth } from 'express-openid-connect';
import connectDB from './config/database.js';
import User from './models/User.js';
import Group from './models/Group.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateDistance, isWithinRadius, direction } from './utils/proximity.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { decode as jwtDecode } from 'jsonwebtoken';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// JWT verification middleware for React Native
const verifyJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-sap6daz2obvosbk4.ca.auth0.com'}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE || 'https://your-api-identifier',
  issuer: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-sap6daz2obvosbk4.ca.auth0.com',
  algorithms: ['RS256']
});

// Middleware to handle both web OAuth and React Native JWT
const authenticateUser = async (req, res, next) => {
  try {
    // Check if it's a React Native request (has Authorization header)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      // React Native JWT flow
      const token = req.headers.authorization.substring(7);
      const decoded = jwtDecode(token);
      
      if (decoded && decoded.sub) {
        req.oidc = {
          isAuthenticated: () => true,
          user: {
            sub: decoded.sub,
            email: decoded.email,
            name: decoded.name || decoded.nickname,
            picture: decoded.picture
          }
        };
      }
    }
    // If no Authorization header, let express-openid-connect handle it (web flow)
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next();
  }
};

app.use(authenticateUser);

// Web OAuth configuration (only for web browsers)
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL || 'https://hack-the-6ix.onrender.com/',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-sap6daz2obvosbk4.ca.auth0.com',
};

app.use(auth(config));

// Middleware to automatically create user after authentication
app.use(async (req, res, next) => {
  if (req.oidc.isAuthenticated() && req.oidc.user) {
    try {
      const uid = req.oidc.user.sub;
      const email = req.oidc.user.email;
      const name = req.oidc.user.name || req.oidc.user.nickname || email.split('@')[0];
      const profilePicture = req.oidc.user.picture || null;
      
      // Check if user already exists by uid
      let user = await User.findOne({ uid });
      
      if (!user) {
        // Also check if user exists by email to avoid duplicates
        user = await User.findOne({ email });
        
        if (user) {
          // Update existing user with new uid if they don't have one
          if (!user.uid) {
            user.uid = uid;
            user.name = name;
            user.profilePicture = profilePicture;
            await user.save();
            console.log(`Updated existing user with uid: ${name} (${email})`);
          }
        } else {
          // Create new user with data from Google authentication
          user = new User({
            uid,
            email,
            name,
            profilePicture,
            location: null,
            groupId: null
          });
          
          await user.save();
          console.log(`Auto-created user: ${name} (${email})`);
        }
      }
    } catch (error) {
      console.error('Error in auto-user creation middleware:', error);
      // Don't block the request if user creation fails
    }
  }
  next();
});

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.post('/users', async (req, res) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const uid = req.oidc.user.sub;
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

    const uid = req.oidc.user.sub; // Use Auth0 ID as uid
    
    if (!name || !uid) {
      return res.status(400).json({ error: 'Group name and user authentication are required' });
    }
    
    // Find the user in MongoDB
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please create a user profile first.' });
    }
    
    const groupId = uuidv4();
    
    const group = new Group({
      groupId,
      name,
      users: [uid] // Use the Auth0 ID as uid
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
    const uid = req.oidc.user.sub; // Use Auth0 ID as uid
    
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
    const uid = req.oidc.user.sub; // Use Auth0 ID as uid
    
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

