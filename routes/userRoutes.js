import express from 'express';
import { registerUser, loginUser, getUserData, deleteUserData, listUsers } from '../controllers/userControllers';
import { validateUser, validateAccessToken } from '../middlewares/validateUsers';

const router = express.Router();

// Solution 1: Register Route
router.post('/register', validateUser, registerUser);

// Solution 2: Login Route
router.post('/login', loginUser);

// Solution 2: Get User Data Route
router.get('/get', validateAccessToken, getUserData);

// Solution 2: Delete User Data Route
router.put('/delete', validateAccessToken, deleteUserData);

// Solution 2: List Users Route
router.get('/list/:page', listUsers);

export default router;
