import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

// Solution 1: Validate User Registration
export const validateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Solution 2: Validate Access Token
export const validateAccessToken = async (req, res, next) => {
    const accessToken = req.headers['access_token'];

    if (!accessToken) {
        return res.status(400).json({ message: 'Access token required' });
    }

    try {
        const user = await User.findById(accessToken);

        if (!user) {
            return res.status(400).json({ message: 'Invalid access token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
