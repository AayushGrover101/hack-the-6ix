import { io } from 'socket.io-client';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const SERVER_URL = 'http://localhost:3000';
const USERS = {
  '1': { uid: 'user1', name: 'Alice Johnson' },
  '2': { uid: 'user2', name: 'Bob Smith' },
  '3': { uid: 'user3', name: 'Charlie Brown' }
};

let socket = null;
let currentUser = null;
let currentUserId = null;

function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

function showMenu() {
  console.log('\n=== Socket.IO Test Client ===');
  console.log('1. Connect as user');
  console.log('2. Update location');
  console.log('3. Refresh user data');
  console.log('5. Simulate movement');
  console.log('6. Disconnect');
  console.log('7. Show current status');
  console.log('8. Exit');
  console.log('💡 Boops happen automatically when users get within 10m!');
  console.log('==========================');
}

function connectAsUser(userId) {
  if (socket) {
    socket.disconnect();
  }

  currentUserId = userId;
  currentUser = USERS[userId];
  
  log(`Connecting as ${currentUser.name} (${currentUser.uid})...`);
  
  socket = io(SERVER_URL, {
    extraHeaders: {
      'x-user-id': currentUserId
    }
  });

  socket.on('connect', () => {
    log(`✅ Connected as ${currentUser.name}`);
    
    // Auto-refresh user data
    setTimeout(() => {
      socket.emit('refresh_user', { uid: currentUser.uid });
      log('🔄 Auto-refreshing user data...');
    }, 1000);
  });

  socket.on('disconnect', () => {
    log('❌ Disconnected');
  });

  socket.on('location_update_success', (data) => {
    log(`✅ Location updated: ${JSON.stringify(data)}`);
  });

  socket.on('location_update_error', (data) => {
    log(`❌ Location update failed: ${JSON.stringify(data)}`);
  });

  socket.on('user_refreshed', (data) => {
    log(`✅ User data refreshed: ${JSON.stringify(data)}`);
  });

  socket.on('user_refresh_error', (data) => {
    log(`❌ User refresh failed: ${JSON.stringify(data)}`);
  });

              socket.on('proximity_alert', (data) => {
                const status = data.canBoop ? '🟢 CAN BOOP' : '🟡 Nearby';
                log(`🚨 PROXIMITY ALERT: ${data.nearbyUser.name} is ${data.distance.toFixed(1)}m away! ${status}`);
            });

            // Auto-boop notifications
            socket.on('boop_happened', (data) => {
                log(`🤝 AUTO-BOOP: ${data.booper.name} and ${data.boopee.name} booped! (${data.distance.toFixed(1)}m apart)`);
            });

            socket.on('boop_success', (data) => {
                log(`✅ AUTO-BOOP SUCCESS: ${data.message} (${data.distance.toFixed(1)}m)`);
            });

  // Removed duplicate boop event handlers - auto-boop notifications are above

  socket.on('member_location_updated', (data) => {
    log(`📍 Group member moved: ${data.name}`);
  });
}

function updateLocation(lat, lng) {
  if (!socket || !socket.connected) {
    log('❌ Not connected');
    return;
  }

  log(`📍 Updating location to: ${lat}, ${lng}`);
  socket.emit('update_location', {
    uid: currentUser.uid,
    latitude: lat,
    longitude: lng
  });
}

function refreshUserData() {
  if (!socket || !socket.connected) {
    log('❌ Not connected');
    return;
  }

  log(`🔄 Refreshing user data for ${currentUser.name}...`);
  socket.emit('refresh_user', { uid: currentUser.uid });
}

// Manual boop function removed - boops happen automatically when users get close
// function boopUser(targetUserId) { ... } - REMOVED

function simulateMovement() {
  if (!socket || !socket.connected) {
    log('❌ Not connected');
    return;
  }

  const baseLat = 43.6532;
  const baseLng = -79.3832;
  const radius = 0.001;

  log('🚶 Simulating movement...');
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const angle = (i / 5) * 2 * Math.PI;
      const lat = baseLat + radius * Math.cos(angle);
      const lng = baseLng + radius * Math.sin(angle);
      
      updateLocation(lat, lng);
    }, i * 2000);
  }
}

function showStatus() {
  console.log('\n=== Current Status ===');
  console.log(`Connected: ${socket && socket.connected ? 'Yes' : 'No'}`);
  console.log(`Current User: ${currentUser ? `${currentUser.name} (${currentUser.uid})` : 'None'}`);
  console.log(`Socket ID: ${socket ? socket.id : 'N/A'}`);
  console.log('=====================');
}

function handleInput(input) {
  const parts = input.trim().split(' ');
  const command = parts[0];

  switch (command) {
    case '1':
      if (parts.length < 2) {
        log('Usage: 1 <user_id> (1, 2, or 3)');
        return;
      }
      const userId = parts[1];
      if (!USERS[userId]) {
        log('Invalid user ID. Use 1, 2, or 3');
        return;
      }
      connectAsUser(userId);
      break;

    case '2':
      if (parts.length < 3) {
        log('Usage: 2 <latitude> <longitude>');
        return;
      }
      const lat = parseFloat(parts[1]);
      const lng = parseFloat(parts[2]);
      updateLocation(lat, lng);
      break;

    case '3':
      refreshUserData();
      break;

    case '4':
      log('❌ Manual boop removed - boops happen automatically when users get close!');
      break;

    case '5':
      simulateMovement();
      break;

    case '6':
      if (socket) {
        socket.disconnect();
        log('Disconnected');
      }
      break;

    case '7':
      showStatus();
      break;

    case '8':
      if (socket) {
        socket.disconnect();
      }
      rl.close();
      process.exit(0);
      break;

    default:
      log('Invalid command. Use 1-8');
  }
}

// Main loop
console.log('Socket.IO Command Line Test Client');
console.log('==================================');
showMenu();

rl.on('line', (input) => {
  handleInput(input);
  showMenu();
});

rl.on('close', () => {
  if (socket) {
    socket.disconnect();
  }
  process.exit(0);
}); 