import mongoose from 'mongoose';

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
  }]
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

export default Group; 