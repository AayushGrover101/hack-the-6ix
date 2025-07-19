import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import schema from './schema';

dotenv.config();

// Apollo Server setup
const server = new ApolloServer({ schema });
await server.start();

const app = express();

app.use(cors());

// Apollo Server middleware
app.use('/api', expressMiddleware(server));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/api');
});
