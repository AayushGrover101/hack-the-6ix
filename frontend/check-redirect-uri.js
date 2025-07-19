const { makeRedirectUri } = require('expo-auth-session');

console.log('\n=== Available Redirect URIs ===\n');

// Default redirect URI (what's currently being used)
const defaultUri = makeRedirectUri({ scheme: 'HT6' });
console.log('1. Default URI (current):', defaultUri);

// Using just the scheme
const schemeOnlyUri = makeRedirectUri({ scheme: 'HT6', path: undefined });
console.log('2. Scheme only:', schemeOnlyUri);

// Using development mode
const devUri = makeRedirectUri({ scheme: 'HT6', useProxy: true });
console.log('3. Development proxy:', devUri);

// Native redirect (for production)
const nativeUri = makeRedirectUri({ native: 'HT6://auth' });
console.log('4. Native URI:', nativeUri);

// Web fallback
const webUri = makeRedirectUri({ scheme: 'https', hostname: 'auth.expo.io' });
console.log('5. Web fallback:', webUri);

console.log('\n=== Recommendation ===');
console.log('For Auth0 configuration, use:', defaultUri);
console.log('Add this to your Auth0 application settings under "Allowed Callback URLs"');
console.log('\n');
