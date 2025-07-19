export const typeDefs = `#graphql
  type Query {
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
