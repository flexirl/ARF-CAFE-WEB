import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser, getProfile, updateProfile, changePassword, getAddresses, addAddress, updateAddress, deleteAddress } from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);

// Protected routes - Profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Protected routes - Addresses
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

export default router;
