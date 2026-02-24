import { Request, Response } from 'express';
import Food from '../models/Food';
import Joi from 'joi';

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req: Request, res: Response) => {
  try {
    const { category, search, all } = req.query;
    let query: any = {};

    // By default, only show available foods (admin can pass ?all=true)
    if (all !== 'true') {
      query.availability = { $ne: false };
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(query);
    res.json(foods);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req: Request, res: Response) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    image: Joi.string().required(),
    preparationTime: Joi.number(),
    isVeg: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const food = new Food(req.body);
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = async (req: Request, res: Response) => {
   try {
    const food = await Food.findById(req.params.id);

    if (food) {
       Object.assign(food, req.body);
       const updatedFood = await food.save();
       res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = async (req: Request, res: Response) => {
  try {
    // findByIdAndDelete is shorter
    const food = await Food.findByIdAndDelete(req.params.id);

    if (food) {
      res.json({ message: 'Food removed' });
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
