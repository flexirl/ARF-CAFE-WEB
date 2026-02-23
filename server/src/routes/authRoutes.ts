import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser } from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);

export default router;
