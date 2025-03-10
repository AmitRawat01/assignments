import express from 'express';
import { registerUser } from '../controllers/userController';
import { validateUser } from '../middlewares/validateUser';

const router = express.Router();

router.post('/register', validateUser, registerUser);

export default router;
