"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInterest = exports.getInterestCount = exports.updateInterestStatus = exports.getClientInterests = exports.getAgentInterests = exports.createInterest = void 0;
const interest_model_1 = __importDefault(require("../models/interest.model"));
const property_model_1 = __importDefault(require("../models/property.model"));
/**
 * Create a new interest/inquiry for a property
 */
const createInterest = async (propertyId, clientId, message) => {
    // Get property to find the agent
    const property = await property_model_1.default.findById(propertyId);
    if (!property) {
        throw new Error("Property not found");
    }
    if (!property.agentId) {
        throw new Error("Property has no assigned agent");
    }
    // Check if client already expressed interest in this property
    const existingInterest = await interest_model_1.default.findOne({
        propertyId,
        clientId,
    });
    if (existingInterest) {
        throw new Error("You have already expressed interest in this property");
    }
    // Create new interest
    const interest = await interest_model_1.default.create({
        propertyId,
        clientId,
        agentId: property.agentId,
        message,
        status: "pending",
    });
    return interest;
};
exports.createInterest = createInterest;
/**
 * Get all interests for an agent's properties
 */
const getAgentInterests = async (agentId, status) => {
    const query = { agentId };
    if (status && ["pending", "contacted", "closed"].includes(status)) {
        query.status = status;
    }
    const interests = await interest_model_1.default.find(query)
        .populate("propertyId", "properties.street_address properties.city properties.price properties.photo_url")
        .populate("clientId", "name email phoneNumber")
        .sort({ createdAt: -1 });
    return interests;
};
exports.getAgentInterests = getAgentInterests;
/**
 * Get all interests by a client
 */
const getClientInterests = async (clientId) => {
    const interests = await interest_model_1.default.find({ clientId })
        .populate("propertyId", "properties")
        .populate("agentId", "name email phoneNumber")
        .sort({ createdAt: -1 });
    return interests;
};
exports.getClientInterests = getClientInterests;
/**
 * Update interest status (agent only)
 */
const updateInterestStatus = async (interestId, agentId, status) => {
    const interest = await interest_model_1.default.findById(interestId);
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
exports.updateInterestStatus = updateInterestStatus;
/**
 * Get interest count for agent's properties
 */
const getInterestCount = async (agentId) => {
    return await interest_model_1.default.countDocuments({ agentId, status: "pending" });
};
exports.getInterestCount = getInterestCount;
/**
 * Delete an interest
 */
const deleteInterest = async (interestId, userId) => {
    const interest = await interest_model_1.default.findById(interestId);
    if (!interest) {
        throw new Error("Interest not found");
    }
    // Allow deletion by either the client who created it or the agent
    if (interest.clientId.toString() !== userId &&
        interest.agentId.toString() !== userId) {
        throw new Error("Not authorized to delete this interest");
    }
    await interest_model_1.default.findByIdAndDelete(interestId);
};
exports.deleteInterest = deleteInterest;
