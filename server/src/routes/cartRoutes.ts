import express from 'express';
import { getCart, addToCart, updateCartItem, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/').get(getCart).post(addToCart).delete(clearCart);
router.route('/:foodId').put(updateCartItem);

export default router;
