const users = [
    { id: '1', username: 'alice', password: '1234' },
    { id: '2', username: 'bob', password: 'abcd' }
];
import { createToken } from './utils/auth.js';
export const resolvers = {
    Query: {
        me(parent, args, context) {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return users.find((user) => user.id === context.user.id);
        },
    },
    Mutation: {
        login(parent, { username, password }) {
            const user = users.find((user) => user.username === username && user.password === password);
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const token = createToken(user);
            return {
                token,
                user: {
                    id: user.id,
                    username: user.username
                },
            };
        }
    }
};
