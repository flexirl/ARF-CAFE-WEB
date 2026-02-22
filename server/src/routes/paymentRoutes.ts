import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

export default router;
