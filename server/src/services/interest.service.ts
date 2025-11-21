import Interest, { type IInterest } from "../models/interest.model";
import Property from "../models/property.model";
import User from "../models/user.model";
import mongoose from "mongoose";

/**
 * Create a new interest/inquiry for a property
 */
export const createInterest = async (
  propertyId: string,
  clientId: string,
  message?: string,
): Promise<IInterest> => {
  // Get property to find the agent
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  if (!property.agentId) {
    throw new Error("Property has no assigned agent");
  }

  // Check if client already expressed interest in this property
  const existingInterest = await Interest.findOne({
    propertyId,
    clientId,
  });

  if (existingInterest) {
    throw new Error("You have already expressed interest in this property");
  }

  // Create new interest
  const interest = await Interest.create({
    propertyId,
    clientId,
    agentId: property.agentId,
    message,
    status: "pending",
  });

  return interest;
};

/**
 * Get all interests for an agent's properties
 */
export const getAgentInterests = async (
  agentId: string,
  status?: string,
): Promise<IInterest[]> => {
  const query: any = { agentId };

  if (status && ["pending", "contacted", "closed"].includes(status)) {
    query.status = status;
  }

  const interests = await Interest.find(query)
    .populate(
      "propertyId",
      "properties.street_address properties.city properties.price properties.photo_url",
    )
    .populate("clientId", "name email phoneNumber")
    .sort({ createdAt: -1 });

  return interests;
};

/**
 * Get all interests by a client
 */
export const getClientInterests = async (
  clientId: string,
): Promise<IInterest[]> => {
  const interests = await Interest.find({ clientId })
    .populate("propertyId", "properties")
    .populate("agentId", "name email phoneNumber")
    .sort({ createdAt: -1 });

  return interests;
};

/**
 * Update interest status (agent only)
 */
export const updateInterestStatus = async (
  interestId: string,
  agentId: string,
  status: "pending" | "contacted" | "closed",
): Promise<IInterest> => {
  const interest = await Interest.findById(interestId);

  if (!interest) {
    throw new Error("Interest not found");
  }

  // Verify the agent owns this interest
  if (interest.agentId.toString() !== agentId) {
    throw new Error("Not authorized to update this interest");
  }

  interest.status = status;
  await interest.save();

  return interest;
};

/**
 * Get interest count for agent's properties
 */
export const getInterestCount = async (agentId: string): Promise<number> => {
  return await Interest.countDocuments({ agentId, status: "pending" });
};

/**
 * Delete an interest
 */
export const deleteInterest = async (
  interestId: string,
  userId: string,
): Promise<void> => {
  const interest = await Interest.findById(interestId);

  if (!interest) {
    throw new Error("Interest not found");
  }

  // Allow deletion by either the client who created it or the agent
  if (
    interest.clientId.toString() !== userId &&
    interest.agentId.toString() !== userId
  ) {
    throw new Error("Not authorized to delete this interest");
  }

  await Interest.findByIdAndDelete(interestId);
};
