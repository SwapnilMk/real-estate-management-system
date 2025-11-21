import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status: "pending" | "read" | "responded";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "read", "responded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient querying
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export default Contact;
