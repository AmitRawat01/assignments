import bcrypt from 'bcryptjs';
import { User } from '../models/User';

// Define argument types for the resolvers
interface RegisterArgs {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  id: string;
  firstname: string;
  lastname: string;
}

interface LoginArgs {
  username: string;
  password: string;
}

interface AccessTokenArgs {
  accessToken: string;
}

interface ListUsersArgs {
  page: number;
}

export const resolvers = {
  Mutation: {
    // Register resolver
    async register(
      _: unknown,
      { username, password, confirmPassword, email, id, firstname, lastname }: RegisterArgs
    ) {
      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check for existing username or email
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        id,
        firstname,
        lastname,
        accessToken: null,
      });

      // Save the user to the database
      await newUser.save();

      return 'User registered successfully';
    },

    // Login resolver
    async login(_: unknown, { username, password }: LoginArgs) {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid username or password');
      }

      // Generate and store the access token (using the MongoDB ID as a token for simplicity)
      user.accessToken = user.id;
      await user.save();

      return user.accessToken;
    },

    // Delete user resolver
    async deleteUser(_: unknown, { accessToken }: AccessTokenArgs) {
      // Find and delete the user by access token
      const user = await User.findOneAndDelete({ id: accessToken });
      if (!user) {
        throw new Error('User not found');
      }
      return 'User deleted';
    },
  },

  Query: {
    // Get user resolver
    async getUser(_: unknown, { accessToken }: AccessTokenArgs) {
      // Find the user by access token
      const user = await User.findOne({ id: accessToken });
      if (!user) {
        throw new Error('Invalid access token');
      }
      return user;
    },

    // List users resolver
    async listUsers(_: unknown, { page }: ListUsersArgs) {
      const PAGE_SIZE = 10; // Number of users per page
      const users = await User.find({})
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      return users;
    },
  },
};
