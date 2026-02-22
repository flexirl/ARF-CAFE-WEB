import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  availability: boolean;
  preparationTime?: number;
  rating: number;
  createdAt: Date;
}

const FoodSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  availability: { type: Boolean, default: true },
  preparationTime: { type: Number },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFood>('Food', FoodSchema);
