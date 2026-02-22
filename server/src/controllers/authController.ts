import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
        const accessToken = generateToken((user._id as unknown) as string);
        const refreshToken = generateRefreshToken((user._id as unknown) as string);

        user.refreshToken = refreshToken;
        await user.save();
        
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken, 
        refreshToken
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateToken((user._id as unknown) as string);
        const refreshToken = generateRefreshToken((user._id as unknown) as string);

        user.refreshToken = refreshToken;
        await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
             return res.status(403).json({ message: 'Invalid refresh token' });
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
             if (err) {
                 return res.status(403).json({ message: 'Invalid refresh token log' });
             }
             
             const accessToken = generateToken((user._id as unknown) as string);
             res.json({ accessToken });
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (or Protected if needed)
export const logoutUser = async (req: Request, res: Response) => {
     // In a stateless JWT setup, logout is handled client-side by deleting tokens.
     // However, for extra security, we can remove the refreshToken from DB.
     // Assuming we get refreshToken in body for explicit logout
     const { refreshToken } = req.body;
     try {
         const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
         res.json({ message: 'Logged out successfully' });
     } catch (err: any) {
         res.status(500).json({ message: err.message });
     }
}
