import Property from "../models/property.model";
import User from "../models/user.model";
import Interest from "../models/interest.model";
import mongoose from "mongoose";
import { ParsedQs } from "qs";

// Helper to flatten the GeoJSON property structure for the frontend
const flattenProperty = (doc: any) => {
  if (!doc) return null;
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

export const getProperties = async (query: ParsedQs) => {
  const {
    page = 1,
    limit = 12,
    type,
    minPrice,
    maxPrice,
    beds,
    propertyType,
    bounds,
    location,
  } = query;

  const filter: any = {};
  if (type && type !== "any") filter["properties.type"] = type;
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
    filter.$text = { $search: location as string };
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

  const properties = await Property.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .lean();

  const totalCount = await Property.countDocuments(filter);

  return {
    properties: properties.map(flattenProperty),
    totalCount,
  };
};

export const getPropertyById = async (id: string) => {
  let property;

  // Check if it's a listing_id (starts with 'L') or MongoDB ObjectId
  if (id.startsWith("L")) {
    property = await Property.findOne({ "properties.listing_id": id })
      .populate("agentId", "name email phoneNumber avatar")
      .lean();
  } else {
    property = await Property.findById(id)
      .populate("agentId", "name email phoneNumber avatar")
      .lean();
  }

  return flattenProperty(property);
};

export const getSimilarProperties = async (id: string) => {
  let property;

  // Check if it's a listing_id (starts with 'L') or MongoDB ObjectId
  if (id.startsWith("L")) {
    property = await Property.findOne({ "properties.listing_id": id });
  } else {
    property = await Property.findById(id);
  }

  if (!property) return [];

  // User requested "randoms only"
  const similar = await Property.aggregate([
    { $match: { _id: { $ne: property._id } } },
    { $sample: { size: 3 } },
  ]);

  return similar.map(flattenProperty);
};

export const addToWishlist = async (userId: string, propertyId: string) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedHomes: propertyId } },
    { new: true },
  );
};

export const removeFromWishlist = async (
  userId: string,
  propertyId: string,
) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { savedHomes: propertyId } },
    { new: true },
  );
};

/**
 * Get user's saved/wishlist properties
 */
export const getSavedProperties = async (userId: string) => {
  const user = await User.findById(userId).populate("savedHomes");
  if (!user) throw new Error("User not found");

  return user.savedHomes.map(flattenProperty);
};

export const createProperty = async (propertyData: any, agentId: string) => {
  const newProperty = new Property({
    ...propertyData,
    agentId,
  });
  return await newProperty.save();
};

export const updateProperty = async (
  id: string,
  propertyData: any,
  agentId: string,
) => {
  const property = await Property.findById(id);
  if (!property) throw new Error("Property not found");

  if (property.agentId && property.agentId.toString() !== agentId) {
    throw new Error("Not authorized to update this property");
  }

  return await Property.findByIdAndUpdate(id, propertyData, { new: true });
};

export const getAgentProperties = async (agentId: string) => {
  const properties = await Property.find({ agentId });
  return properties.map(flattenProperty);
};

export const getDashboardStats = async (agentId: string) => {
  const totalProperties = await Property.countDocuments({ agentId });
  const recentPropertiesDocs = await Property.find({ agentId })
    .sort({ createdAt: -1 })
    .limit(5);
  const recentProperties = recentPropertiesDocs.map(flattenProperty);

  const totalInterests = await Interest.countDocuments({ agentId });
  const pendingInterests = await Interest.countDocuments({
    agentId,
    status: "pending",
  });
  const closedInterests = await Interest.countDocuments({
    agentId,
    status: "closed",
  });

  // Monthly interests aggregation (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyInterests = await Interest.aggregate([
    {
      $match: {
        agentId: new mongoose.Types.ObjectId(agentId),
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

  const propertiesByType = await Property.aggregate([
    { $match: { agentId: new mongoose.Types.ObjectId(agentId) } },
    { $group: { _id: "$properties.type", count: { $sum: 1 } } },
  ]);

  const totalUsers = await User.countDocuments({ role: "CLIENT" });

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

export const deleteProperty = async (id: string, agentId: string) => {
  const property = await Property.findById(id);
  if (!property) throw new Error("Property not found");

  if (property.agentId && property.agentId.toString() !== agentId) {
    throw new Error("Not authorized to delete this property");
  }

  return await Property.findByIdAndDelete(id);
};

export const bulkDeleteProperties = async (ids: string[], agentId: string) => {
  const properties = await Property.find({ _id: { $in: ids } });

  const unauthorized = properties.some(
    (property) => property.agentId && property.agentId.toString() !== agentId,
  );

  if (unauthorized) {
    throw new Error("Not authorized to delete one or more properties");
  }

  return await Property.deleteMany({ _id: { $in: ids }, agentId });
};

export const getAgentFavoritedProperties = async (agentId: string) => {
  // 1. Find all properties belonging to the agent
  const agentProperties = await Property.find({ agentId }).select(
    "_id properties",
  );

  if (!agentProperties.length) return [];

  const propertyIds = agentProperties.map((p) => p._id);

  // 2. Find users who have these properties in their savedHomes
  const users = await User.find({
    savedHomes: { $in: propertyIds },
    role: "CLIENT",
  }).select("name email phoneNumber savedHomes");

  // 3. Map properties to the users who favorited them
  const result = agentProperties
    .map((property) => {
      const interestedUsers = users.filter((user) =>
        user.savedHomes.some(
          (savedId) => savedId.toString() === property._id.toString(),
        ),
      );

      if (interestedUsers.length === 0) return null;

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
