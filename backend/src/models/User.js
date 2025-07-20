import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: false,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude] for MongoDB geospatial queries
      default: null
    }
  },
  groupId: {
    type: String,
    default: null,
    index: true
  },
  // Friend system
  friends: [{
    type: String, // Array of friend UIDs
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: String,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Privacy settings
  privacySettings: {
    shareLocation: {
      type: Boolean,
      default: true
    },
    showToFriends: {
      type: Boolean,
      default: true
    },
    showToEveryone: {
      type: Boolean,
      default: false
    },
    proximityAlerts: {
      type: Boolean,
      default: true
    }
  },
  // Proximity settings
  proximitySettings: {
    hotZone: {
      type: Number,
      default: 50 // meters - strong vibration
    },
    warmZone: {
      type: Number,
      default: 200 // meters - medium vibration
    },
    coldZone: {
      type: Number,
      default: 1000 // meters - light vibration
    }
  },
  // Last seen
  lastSeen: {
    type: Date,
    default: Date.now
  },
  // Online status
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create a geospatial index on location coordinates
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User; 