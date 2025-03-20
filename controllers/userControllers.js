import { User, Address } from '../models/User.js';
import AccessToken from '../models/AccessToken.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate Access Token using md5
const generateAccessToken = (userId) => {
    const data = userId + Date.now().toString();
    const accessToken = crypto.createHash('md5').update(data).digest('hex');
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
    return { user_id: userId, access_token: accessToken, expiry };
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        let existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ data: [], message: 'Username already exists' });

        existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ data: [], message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, firstname, lastname });
        await newUser.save();

        res.status(201).json({ data: [], message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ data: [], message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ data: [], message: 'Invalid credentials' });

        const { user_id, access_token, expiry } = generateAccessToken(user._id);
        await AccessToken.create({ user_id, access_token, expiry });

        res.status(200).json({ data: { access_token }, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};

// Create User Address
export const createUserAddress = async (req, res) => {
    const { user_id, address, city, state, pinCode, phoneNo } = req.body;
    const accessToken = req.headers['access_token'];

    try {
        const tokenData = await AccessToken.findOne({ user_id, access_token: accessToken });
        if (!tokenData || new Date() > tokenData.expiry) return res.status(401).json({ data: [], message: 'Invalid access token' });

        const newAddress = new Address({ user_id, address, city, state, pinCode, phoneNo });
        await newAddress.save();

        await User.findByIdAndUpdate(user_id, { $push: { addresses: newAddress._id } });

        res.status(201).json({ data: [], message: 'Address added successfully' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};

// Get User Data including Addresses
export const getUserData = async (req, res) => {
    const userId = req.params.id;
    const accessToken = req.headers['access_token'];

    try {
        const tokenData = await AccessToken.findOne({ user_id: userId, access_token: accessToken });
        if (!tokenData || new Date() > tokenData.expiry) return res.status(401).json({ data: [], message: 'Invalid access token' });

        const userData = await User.findById(userId).populate('addresses');

        res.status(200).json({ data: userData, message: 'User data retrieved successfully' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};

// Delete User Data
export const deleteUserData = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ data: [], message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};

// List Users
export const listUsers = async (req, res) => {
    const page = parseInt(req.params.page, 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const users = await User.find().skip(skip).limit(limit);
        res.status(200).json({ data: users, message: 'Users retrieved successfully' });
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};
