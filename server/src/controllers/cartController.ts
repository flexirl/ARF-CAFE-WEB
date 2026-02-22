import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Food from '../models/Food';
import Settings from '../models/Settings';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ userId: req.user?._id as any });
    if (!cart) {
        cart = await Cart.create({ userId: req.user?._id as any, items: [] });
    }
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: Request, res: Response) => {
  const { foodId, quantity } = req.body;

  try {
    const settings = await Settings.findOne();
    if (settings && !settings.isStoreOpen) {
      return res.status(400).json({ message: 'Store is currently closed' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (!food.availability) {
      return res.status(400).json({ message: 'This item is currently out of stock' });
    }

    let cart = await Cart.findOne({ userId: req.user?._id as any });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user?._id as any,
        items: [{ foodId, name: food.name, price: food.price, image: food.image, quantity }],
        totalAmount: food.price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ 
            foodId: food._id as any, // Cast to any or ObjectId 
            name: food.name, 
            price: food.price, 
            image: food.image, 
            quantity 
        });
      }
      
      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
    }
    
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:foodId
// @access  Private
export const updateCartItem = async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const { foodId } = req.params;

    try {
        let cart = await Cart.findOne({ userId: req.user?._id as any });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
             cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
             await cart.save();
             res.json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({ userId: req.user?._id as any });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}
