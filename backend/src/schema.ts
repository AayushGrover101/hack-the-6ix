import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

// Define GraphQL schema
const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello world!',
    },
  },
});

const schema = new GraphQLSchema({ query: QueryRoot });

export default schema;