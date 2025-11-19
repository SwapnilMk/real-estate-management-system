import mongoose from "mongoose"

export interface IContact extends mongoose.Document {
  name: string
  email: string
  phoneNumber?: string
  message: string
  createdAt: Date
}

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema)

