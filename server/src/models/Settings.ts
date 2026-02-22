import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  deliveryFee: number;
  gstPercent: number;
  freeDeliveryAbove: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    deliveryFee: { type: Number, default: 40 },
    gstPercent: { type: Number, default: 5 },
    freeDeliveryAbove: { type: Number, default: 0 }, // 0 = disabled
  },
  { timestamps: true }
);

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
export default Settings;
