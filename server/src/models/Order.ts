import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  foodId: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  phoneVerified: boolean;
  paymentMethod: 'razorpay' | 'cod';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'placed' },
  deliveryAddress: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  phoneVerified: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', OrderSchema);
