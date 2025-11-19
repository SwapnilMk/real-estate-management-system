import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "AGENT" | "CLIENT";
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  phoneNumber: string;
  savedSearches: mongoose.Types.ObjectId[];
  savedHomes: mongoose.Types.ObjectId[];
  lastLogin: Date;
  comparePassword(candidate: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["AGENT", "CLIENT"],
      default: "CLIENT",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    phoneNumber: { type: String },
    savedSearches: [{ type: Schema.Types.ObjectId, ref: "Search" }],
    savedHomes: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// hash password before save if modified
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// generates a token (plain) and stores hash in DB
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordToken = hashed;
  // token valid for 1 hour
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
