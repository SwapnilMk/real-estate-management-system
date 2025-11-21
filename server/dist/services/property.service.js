"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentFavoritedProperties = exports.bulkDeleteProperties = exports.deleteProperty = exports.getDashboardStats = exports.getAgentProperties = exports.updateProperty = exports.createProperty = exports.getSavedProperties = exports.removeFromWishlist = exports.addToWishlist = exports.getSimilarProperties = exports.getPropertyById = exports.getProperties = void 0;
const property_model_1 = __importDefault(require("../models/property.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const interest_model_1 = __importDefault(require("../models/interest.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// Helper to flatten the GeoJSON property structure for the frontend
const flattenProperty = (doc) => {
    if (!doc)
        return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    // Handle Map conversion for all_photos if it exists as a Map
    let all_photos = obj.properties?.all_photos;
    if (all_photos instanceof Map) {
        all_photos = Object.fromEntries(all_photos);
    }
    return {
        ...obj.properties,
        all_photos,
        id: obj._id, // Use the Mongo ID as the main ID
        _id: obj._id,
        user: obj.agentId, // Include populated agent details
    };
};
const getProperties = async (query) => {
    const { page = 1, limit = 12, type, minPrice, maxPrice, beds, propertyType, bounds, location, } = query;
    const filter = {};
    if (type && type !== "any")
        filter["properties.type"] = type;
    if (minPrice && minPrice !== "any")
        filter["properties.price"] = {
            ...filter["properties.price"],
            $gte: Number(minPrice),
        };
    if (maxPrice && maxPrice !== "any")
        filter["properties.price"] = {
            ...filter["properties.price"],
            $lte: Number(maxPrice),
        };
    if (beds && beds !== "any")
        filter["properties.bedrooms_total"] = { $gte: Number(beds) };
    if (propertyType && propertyType !== "any")
        filter["properties.type"] = propertyType;
    if (location) {
        filter.$text = { $search: location };
    }
    // if (bounds) {
    //   const [swLng, swLat, neLng, neLat] = (bounds as string)
    //     .split(",")
    //     .map(parseFloat);
    //   filter.geometry = {
    //     $geoWithin: {
    //       $box: [
    //         [swLng, swLat],
    //         [neLng, neLat],
    //       ],
    //     },
    //   };
    // }
    const properties = await property_model_1.default.find(filter)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .lean();
    const totalCount = await property_model_1.default.countDocuments(filter);
    return {
        properties: properties.map(flattenProperty),
        totalCount,
    };
};
exports.getProperties = getProperties;
const getPropertyById = async (id) => {
    let property;
    // Check if it's a listing_id (starts with 'L') or MongoDB ObjectId
    if (id.startsWith("L")) {
        property = await property_model_1.default.findOne({ "properties.listing_id": id })
            .populate("agentId", "name email phoneNumber avatar")
            .lean();
    }
    else {
        property = await property_model_1.default.findById(id)
            .populate("agentId", "name email phoneNumber avatar")
            .lean();
    }
    return flattenProperty(property);
};
exports.getPropertyById = getPropertyById;
const getSimilarProperties = async (id) => {
    let property;
    // Check if it's a listing_id (starts with 'L') or MongoDB ObjectId
    if (id.startsWith("L")) {
        property = await property_model_1.default.findOne({ "properties.listing_id": id });
    }
    else {
        property = await property_model_1.default.findById(id);
    }
    if (!property)
        return [];
    // User requested "randoms only"
    const similar = await property_model_1.default.aggregate([
        { $match: { _id: { $ne: property._id } } },
        { $sample: { size: 3 } },
    ]);
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
/**
 * Get user's saved/wishlist properties
 */
const getSavedProperties = async (userId) => {
    const user = await user_model_1.default.findById(userId).populate("savedHomes");
    if (!user)
        throw new Error("User not found");
    return user.savedHomes.map(flattenProperty);
};
exports.getSavedProperties = getSavedProperties;
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
    if (property.agentId && property.agentId.toString() !== agentId) {
        throw new Error("Not authorized to update this property");
    }
    return await property_model_1.default.findByIdAndUpdate(id, propertyData, { new: true });
};
exports.updateProperty = updateProperty;
const getAgentProperties = async (agentId) => {
    const properties = await property_model_1.default.find({ agentId });
    return properties.map(flattenProperty);
};
exports.getAgentProperties = getAgentProperties;
const getDashboardStats = async (agentId) => {
    const totalProperties = await property_model_1.default.countDocuments({ agentId });
    const recentPropertiesDocs = await property_model_1.default.find({ agentId })
        .sort({ createdAt: -1 })
        .limit(5);
    const recentProperties = recentPropertiesDocs.map(flattenProperty);
    const totalInterests = await interest_model_1.default.countDocuments({ agentId });
    const pendingInterests = await interest_model_1.default.countDocuments({
        agentId,
        status: "pending",
    });
    const closedInterests = await interest_model_1.default.countDocuments({
        agentId,
        status: "closed",
    });
    // Monthly interests aggregation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyInterests = await interest_model_1.default.aggregate([
        {
            $match: {
                agentId: new mongoose_1.default.Types.ObjectId(agentId),
                createdAt: { $gte: sixMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const propertiesByType = await property_model_1.default.aggregate([
        { $match: { agentId: new mongoose_1.default.Types.ObjectId(agentId) } },
        { $group: { _id: "$properties.type", count: { $sum: 1 } } },
    ]);
    const totalUsers = await user_model_1.default.countDocuments({ role: "CLIENT" });
    return {
        totalProperties,
        recentProperties,
        totalUsers,
        totalInterests,
        pendingInterests,
        closedInterests,
        monthlyInterests,
        propertiesByType,
    };
};
exports.getDashboardStats = getDashboardStats;
const deleteProperty = async (id, agentId) => {
    const property = await property_model_1.default.findById(id);
    if (!property)
        throw new Error("Property not found");
    if (property.agentId && property.agentId.toString() !== agentId) {
        throw new Error("Not authorized to delete this property");
    }
    return await property_model_1.default.findByIdAndDelete(id);
};
exports.deleteProperty = deleteProperty;
const bulkDeleteProperties = async (ids, agentId) => {
    const properties = await property_model_1.default.find({ _id: { $in: ids } });
    const unauthorized = properties.some((property) => property.agentId && property.agentId.toString() !== agentId);
    if (unauthorized) {
        throw new Error("Not authorized to delete one or more properties");
    }
    return await property_model_1.default.deleteMany({ _id: { $in: ids }, agentId });
};
exports.bulkDeleteProperties = bulkDeleteProperties;
const getAgentFavoritedProperties = async (agentId) => {
    // 1. Find all properties belonging to the agent
    const agentProperties = await property_model_1.default.find({ agentId }).select("_id properties");
    if (!agentProperties.length)
        return [];
    const propertyIds = agentProperties.map((p) => p._id);
    // 2. Find users who have these properties in their savedHomes
    const users = await user_model_1.default.find({
        savedHomes: { $in: propertyIds },
        role: "CLIENT",
    }).select("name email phoneNumber savedHomes");
    // 3. Map properties to the users who favorited them
    const result = agentProperties
        .map((property) => {
        const interestedUsers = users.filter((user) => user.savedHomes.some((savedId) => savedId.toString() === property._id.toString()));
        if (interestedUsers.length === 0)
            return null;
        return {
            property: flattenProperty(property),
            users: interestedUsers.map((u) => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                phoneNumber: u.phoneNumber,
            })),
        };
    })
        .filter((item) => item !== null); // Only return properties that have been favorited
    return result;
};
exports.getAgentFavoritedProperties = getAgentFavoritedProperties;
