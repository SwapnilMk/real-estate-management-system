import mongoose, { Schema, type Document } from "mongoose";

export interface IInterest extends Document {
  propertyId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  message?: string;
  status: "pending" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const InterestSchema = new Schema<IInterest>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index for faster queries
InterestSchema.index({ agentId: 1, status: 1 });
InterestSchema.index({ clientId: 1 });
InterestSchema.index({ propertyId: 1 });

const Interest = mongoose.model<IInterest>("Interest", InterestSchema);
export default Interest;
