import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Food from '../models/Food';
import Settings from '../models/Settings';
import { io } from '../server';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
    const { deliveryAddress, paymentMethod, customerName, customerPhone, items, totalAmount } = req.body;

    try {
        const settings = await Settings.findOne();
        if (settings && !settings.isStoreOpen) {
            return res.status(400).json({ message: 'Store is currently closed. We are not accepting orders at this time.' });
        }

        // Verify food availability
        for (const item of items) {
            const food = await Food.findById(item.foodId);
            if (!food) {
                return res.status(404).json({ message: `Food item '${item.name}' not found.` });
            }
            if (!food.availability) {
                return res.status(400).json({ message: `'${item.name}' is currently out of stock.` });
            }
        }

        const order = new Order({
            userId: req.user?._id as any,
            items,
            totalAmount,
            deliveryAddress,
            customerName,
            customerPhone,
            phoneVerified: true, // Verified via OTP on frontend
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        });

        const createdOrder = await order.save();

        // Emit real-time event to admin
        io.to('admin-room').emit('new-order', createdOrder);

        // Clear cart if exists
        const cart = await Cart.findOne({ userId: req.user?._id as any });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }

        res.status(201).json(createdOrder);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ userId: req.user?._id as any }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).populate('userId', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.orderStatus || order.orderStatus;
            order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

            const updatedOrder = await order.save();
            // Emit real-time event to admin
            io.to('admin-room').emit('order-updated', updatedOrder);
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
