import express from 'express';
import { auth } from 'express-openid-connect';
import connectDB from './config/database.js';
import User from './models/User.js';
import Group from './models/Group.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: '5bfZuXoxPdFBjfX2FYLX6Y6cIRTThLlH',
  issuerBaseURL: 'https://dev-sap6daz2obvosbk4.ca.auth0.com',
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});