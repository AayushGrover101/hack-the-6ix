import express from 'express';
import { auth } from 'express-openid-connect';

const app = express();
const port = process.env.PORT || 3000;
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: '5bfZuXoxPdFBjfX2FYLX6Y6cIRTThLlH',
  issuerBaseURL: 'https://dev-sap6daz2obvosbk4.ca.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});