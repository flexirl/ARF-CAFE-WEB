import express from 'express';
import { createOrder, getMyOrders, getOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder).get(admin, getOrders);
router.route('/my').get(getMyOrders);
router.route('/:id/status').put(admin, updateOrderStatus);

export default router;
