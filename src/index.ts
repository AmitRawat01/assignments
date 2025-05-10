import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schema';
import { resolvers } from './resolvers/userResolver';

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server before applying middleware
  await server.start();
  server.applyMiddleware({ app });

  // Connection string to MongoDB Atlas
  const MONGO_URI = 'mongodb+srv://user10:user1000@cluster0.gzh1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    // Explicitly cast 'error' to 'any' or 'Error' to access 'message'
    console.error('Error connecting to MongoDB Atlas:', (error as Error).message);
  }

  // Start the Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Start the server
startServer().catch((error) => {
  console.error('Error starting the server:', (error as Error).message);
});
