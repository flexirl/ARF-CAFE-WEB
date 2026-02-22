import { Router, Request, Response } from 'express';
import Settings from '../models/Settings';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// GET /api/settings — public (checkout needs this)
router.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// PUT /api/settings — admin only
router.put('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { deliveryFee, gstPercent, freeDeliveryAbove, isStoreOpen, storeOpensAt } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ deliveryFee, gstPercent, freeDeliveryAbove, isStoreOpen, storeOpensAt });
    } else {
      if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
      if (gstPercent !== undefined) settings.gstPercent = gstPercent;
      if (freeDeliveryAbove !== undefined) settings.freeDeliveryAbove = freeDeliveryAbove;
      if (isStoreOpen !== undefined) settings.isStoreOpen = isStoreOpen;
      if (storeOpensAt !== undefined) settings.storeOpensAt = storeOpensAt;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

export default router;
