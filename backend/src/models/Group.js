import mongoose from 'mongoose';

const boopLogSchema = new mongoose.Schema({
  booper: {
    type: String,
    required: true
  },
  boopee: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: null
    }
  }
}, {
  timestamps: true
});

const groupSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  users: [{
    type: String,
    required: true
  }],
  boopLog: [boopLogSchema]
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

export default Group; 