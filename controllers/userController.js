import User from '../models/User';
import bcrypt from 'bcryptjs';

// Solution 1: Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        let existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, firstname, lastname });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Solution 2: Login User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({ access_token: user._id });
        } else {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Solution 2: Get User Data
export const getUserData = async (req, res) => {
    res.status(200).json({ data: req.user });
};

// Solution 2: Delete User Data
export const deleteUserData = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Solution 2: List Users
export const listUsers = async (req, res) => {
    const page = parseInt(req.params.page, 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const users = await User.find().skip(skip).limit(limit);
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
