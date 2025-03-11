import express from 'express';
import { registerUser } from '../controllers/userController';
import { validateUser } from '../middlewares/validateUser';

const router = express.Router();

router.post('/register', validateUser, registerUser);

export default router;


const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ data: { access_token: user._id }, message: 'Login successful' });
    } else {
        res.status(400).json({ data: [], message: 'Invalid username or password' });
    }
});

// Get User Data
router.get('/get', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({ data: user, message: 'User data retrieved' });
    } else {
        res.status(400).json({ data: [], message: 'User not found' });
    }
});

// Delete User Data
router.put('/delete', auth, async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    if (user) {
        res.json({ data: [], message: 'User deleted' });
    } else {
        res.status(400).json({ data: [], message: 'User not found' });
    }
});

// List Users
router.get('/list/:page', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
    const users = await User.find()
                            .skip((page - 1) * limit)
                            .limit(limit);
    res.json({ data: users, message: 'Users retrieved' });
});

module.exports = router;
