import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { verifyToken } from './utils/auth.js';

dotenv.config();

const users = [
  { id: '1', username: 'alice', password: '1234' },
  { id: '2', username: 'bob', password: 'abcd' }
];

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function start() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken(token);
      const user = decoded && typeof decoded === 'object' && 'userId' in decoded
        ? users.find((u) => u.id === decoded.userId)
        : null;
      return { user };
    },
    listen: { port: 4000 },
  });

  console.log(`🚀 Apollo Server ready at ${url}`);
}
start();