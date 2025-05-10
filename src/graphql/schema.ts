import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    firstname: String!
    lastname: String!
  }

  type Query {
    getUser(accessToken: String!): User
    listUsers(page: Int!): [User]
  }

  type Mutation {
    register(
      username: String!,
      password: String!,
      confirmPassword: String!,
      email: String!,
      id: String!,
      firstname: String!,
      lastname: String!
    ): String!

    login(username: String!, password: String!): String!

    deleteUser(accessToken: String!): String!
  }
`;
