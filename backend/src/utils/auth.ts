import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';

dotenv.config();

// Auth0 configuration
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

// Initialize JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  nickname?: string;
  picture?: string;
}

interface Auth0TokenPayload {
  sub: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
  azp: string;
  scope: string;
}

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyAuth0Token(token: string): Promise<Auth0User | null> {
  return new Promise((resolve) => {
    jwt.verify(token, getKey, {
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        console.error('Error verifying Auth0 token:', err);
        resolve(null);
      } else {
        const payload = decoded as Auth0TokenPayload;
        resolve({
          sub: payload.sub,
          email: payload.email || '',
          name: payload.name,
          nickname: payload.nickname,
          picture: payload.picture
        });
      }
    });
  });
}

export {
  verifyAuth0Token,
  type Auth0User,
  type Auth0TokenPayload
};
