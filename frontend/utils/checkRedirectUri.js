// This script helps you determine the correct redirect URI for Auth0 configuration
const { makeRedirectUri } = require('expo-auth-session/build/AuthSession');
const { Platform } = require('react-native-web');

console.log('\n=== Auth0 Redirect URI Configuration ===\n');

// App scheme from your app.json
const APP_SCHEME = 'HT6';

// Development redirect URI
const devRedirectUri = makeRedirectUri({ 
  scheme: APP_SCHEME, 
  path: 'auth' 
});
console.log('Development URI:', devRedirectUri);

// Production redirect URI (native)
const productionUri = `${APP_SCHEME}://auth`;
console.log('Production URI:', productionUri);

// Web fallback
const webUri = makeRedirectUri({ 
  scheme: 'https', 
  hostname: 'auth.expo.io' 
});
console.log('Web fallback:', webUri);

console.log('\n=== Auth0 Configuration Instructions ===');
console.log('1. Go to your Auth0 Dashboard');
console.log('2. Navigate to Applications > Your App > Settings');
console.log('3. Add these URLs to "Allowed Callback URLs":');
console.log(`   - ${devRedirectUri}`);
console.log(`   - ${productionUri}`);
console.log(`   - ${webUri}`);
console.log('4. Add these URLs to "Allowed Logout URLs":');
console.log(`   - ${devRedirectUri}`);
console.log(`   - ${productionUri}`);
console.log('5. Save Changes');
console.log('\n');
