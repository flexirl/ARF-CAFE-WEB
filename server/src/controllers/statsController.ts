import { Request, Response } from 'express';
import Order from '../models/Order';
import Food from '../models/Food';
import User from '../models/User';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate total revenue from paid orders
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'pending'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalOrders,
      totalFoods,
      totalUsers,
      totalRevenue,
      recentOrders,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
