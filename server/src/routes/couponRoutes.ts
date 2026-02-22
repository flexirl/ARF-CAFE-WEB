import { Router, Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// GET /api/coupons — admin only (list all)
router.get('/', protect, admin, async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
});

// POST /api/coupons — admin only (create)
router.post('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { code, discountType, discountValue, minOrder, maxDiscount, usageLimit, expiresAt } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ message: 'Coupon code already exists' });
      return;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrder: minOrder || 0,
      maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0,
      expiresAt: expiresAt || null,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create coupon' });
  }
});

// DELETE /api/coupons/:id — admin only
router.delete('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
});

// POST /api/coupons/apply — authenticated (validate & apply)
router.post('/apply', protect, async (req: Request, res: Response) => {
  try {
    const { code, orderTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(400).json({ message: 'Invalid or expired coupon code' });
      return;
    }

    // Check expiry
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ message: 'This coupon has expired' });
      return;
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ message: 'This coupon has reached its usage limit' });
      return;
    }

    // Check minimum order
    if (orderTotal < coupon.minOrder) {
      res.status(400).json({ message: `Minimum order of ₹${coupon.minOrder} required for this coupon` });
      return;
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((orderTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Don't let discount exceed order total
    if (discount > orderTotal) discount = orderTotal;

    // Increment usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      discount,
      code: coupon.code,
      message: `Coupon applied! You saved ₹${discount}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply coupon' });
  }
});

export default router;
