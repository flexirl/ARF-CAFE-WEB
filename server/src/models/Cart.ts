import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  foodId: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);
