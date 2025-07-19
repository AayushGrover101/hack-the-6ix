import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack-the-6ix';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    
    // Clean up old indexes that might conflict with current schema
    await cleanupOldIndexes();
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const cleanupOldIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes
    const indexes = await collection.indexes();
    
    // Drop any indexes that reference 'auth0Id' (old schema)
    for (const index of indexes) {
      if (index.key && index.key.auth0Id) {
        console.log(`Dropping old index: ${index.name}`);
        await collection.dropIndex(index.name);
      }
    }
    
    console.log('Database indexes cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up indexes:', error);
  }
};

export default connectDB; 