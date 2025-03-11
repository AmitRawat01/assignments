import { body, validationResult } from 'express-validator';

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



const User = require('../models/user');

module.exports = async (req, res, next) => {
    const accessToken = req.headers['access_token'];
    const user = await User.findById(accessToken);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(400).json({ data: [], message: 'Invalid access token' });
    }
};
