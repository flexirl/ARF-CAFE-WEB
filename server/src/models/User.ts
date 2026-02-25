import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

/* ============================= */
/* Address Interface */
/* ============================= */

export interface IAddress extends Types.Subdocument {
  _id: Types.ObjectId;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phoneNumber: string;
}

/* ============================= */
/* User Interface */
/* ============================= */

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  refreshToken?: string;

  // ✅ FIXED HERE
  addresses: Types.DocumentArray<IAddress>;

  deliveryAddress?: string;
  createdAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

/* ============================= */
/* Address Schema */
/* ============================= */

const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ["home", "work", "other"], required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  phoneNumber: { type: String, required: true },
});

/* ============================= */
/* User Schema */
/* ============================= */

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshToken: { type: String },
  addresses: [AddressSchema],
  deliveryAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

/* ============================= */
/* Password Hash Middleware */
/* ============================= */

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ============================= */
/* Match Password Method */
/* ============================= */

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ============================= */
/* Export Model */
/* ============================= */

export default mongoose.model<IUser>("User", UserSchema);