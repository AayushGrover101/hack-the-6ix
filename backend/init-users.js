import connectDB from './src/config/database.js';
import User from './src/models/User.js';

// Initialize database with 3 users
async function initUsers() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const users = [
      {
        uid: 'user1',
        email: 'alice@example.com',
        name: 'Alice Johnson',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        location: null,
        groupId: null
      },
      {
        uid: 'user2',
        email: 'bob@example.com',
        name: 'Bob Smith',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: null,
        groupId: null
      },
      {
        uid: 'user3',
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: null,
        groupId: null
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ uid: userData.uid });
      
      if (existingUser) {
        console.log(`User ${userData.name} already exists`);
      } else {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.name} (${userData.uid})`);
      }
    }

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initUsers(); 