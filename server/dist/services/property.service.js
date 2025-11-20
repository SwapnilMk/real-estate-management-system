"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getAgentProperties = exports.updateProperty = exports.createProperty = exports.removeFromWishlist = exports.addToWishlist = exports.getSimilarProperties = exports.getPropertyById = exports.getProperties = void 0;
const property_model_1 = __importDefault(require("../models/property.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Helper to flatten the GeoJSON property structure for the frontend
const flattenProperty = (doc) => {
    if (!doc)
        return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
        ...obj.properties,
        id: obj._id, // Use the Mongo ID as the main ID
        _id: obj._id,
    };
};
const getProperties = async (query) => {
    const { page = 1, limit = 12, type, minPrice, maxPrice, beds, propertyType, bounds, } = query;
    const filter = {};
    if (type)
        filter["properties.type"] = type;
    if (minPrice)
        filter["properties.price"] = { $gte: minPrice };
    if (maxPrice)
        filter["properties.price"] = {
            ...filter["properties.price"],
            $lte: maxPrice,
        };
    if (beds)
        filter["properties.bedrooms_total"] = { $gte: beds };
    if (propertyType)
        filter["properties.type"] = propertyType;
    if (bounds) {
        const [swLng, swLat, neLng, neLat] = bounds
            .split(",")
            .map(parseFloat);
        filter.geometry = {
            $geoWithin: {
                $box: [
                    [swLng, swLat],
                    [neLng, neLat],
                ],
            },
        };
    }
    const properties = await property_model_1.default.find(filter)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
    const totalCount = await property_model_1.default.countDocuments(filter);
    return {
        properties: properties.map(flattenProperty),
        totalCount,
    };
};
exports.getProperties = getProperties;
const getPropertyById = async (id) => {
    const property = await property_model_1.default.findById(id);
    return flattenProperty(property);
};
exports.getPropertyById = getPropertyById;
const getSimilarProperties = async (id) => {
    const property = await property_model_1.default.findById(id);
    if (!property)
        return [];
    const similar = await property_model_1.default.find({
        "properties.type": property.properties.type,
        _id: { $ne: id },
    }).limit(3);
    return similar.map(flattenProperty);
};
exports.getSimilarProperties = getSimilarProperties;
const addToWishlist = async (userId, propertyId) => {
    return user_model_1.default.findByIdAndUpdate(userId, { $addToSet: { savedHomes: propertyId } }, { new: true });
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (userId, propertyId) => {
    return user_model_1.default.findByIdAndUpdate(userId, { $pull: { savedHomes: propertyId } }, { new: true });
};
exports.removeFromWishlist = removeFromWishlist;
const createProperty = async (propertyData, agentId) => {
    const newProperty = new property_model_1.default({
        ...propertyData,
        agentId,
    });
    return await newProperty.save();
};
exports.createProperty = createProperty;
const updateProperty = async (id, propertyData, agentId) => {
    const property = await property_model_1.default.findById(id);
    if (!property)
        throw new Error("Property not found");
    // Although checking if the agent owns the property is good practice,
    // for now we might allow admins to edit all properties or check ownership here.
    // Assuming agent can only edit their own properties:
    if (property.agentId && property.agentId.toString() !== agentId) {
        throw new Error("Not authorized to update this property");
    }
    // If properties was not originally created with agentId (legacy data),
    // we might need a policy. For now, strict check if agentId exists on property.
    return await property_model_1.default.findByIdAndUpdate(id, propertyData, { new: true });
};
exports.updateProperty = updateProperty;
const getAgentProperties = async (agentId) => {
    return await property_model_1.default.find({ agentId });
};
exports.getAgentProperties = getAgentProperties;
const getDashboardStats = async (agentId) => {
    const totalProperties = await property_model_1.default.countDocuments({ agentId });
    const recentProperties = await property_model_1.default.find({ agentId })
        .sort({ createdAt: -1 })
        .limit(5);
    // For "users listed", assuming the requirement "agent can see users listed"
    // means all users in the system or users related to the agent.
    // Based on the prompt "agent can see users listed totoal property recent property",
    // it implies a general view or users contacted.
    // I'll include totalUsers count here as well if needed, but we have a separate route for users.
    const totalUsers = await user_model_1.default.countDocuments({ role: "CLIENT" }); // Count only clients maybe?
    return {
        totalProperties,
        recentProperties,
        totalUsers,
    };
};
exports.getDashboardStats = getDashboardStats;
