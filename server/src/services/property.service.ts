import Property from "../models/property.model";
import User from "../models/user.model";
import { ParsedQs } from "qs";

// Helper to flatten the GeoJSON property structure for the frontend
const flattenProperty = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj.properties,
    id: obj._id, // Use the Mongo ID as the main ID
    _id: obj._id,
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
  } = query;

  const filter: any = {};
  if (type) filter["properties.type"] = type;
  if (minPrice) filter["properties.price"] = { $gte: minPrice };
  if (maxPrice)
    filter["properties.price"] = {
      ...filter["properties.price"],
      $lte: maxPrice,
    };
  if (beds) filter["properties.bedrooms_total"] = { $gte: beds };
  if (propertyType) filter["properties.type"] = propertyType;

  if (bounds) {
    const [swLng, swLat, neLng, neLat] = (bounds as string)
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

  const properties = await Property.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const totalCount = await Property.countDocuments(filter);

  return {
    properties: properties.map(flattenProperty),
    totalCount,
  };
};

export const getPropertyById = async (id: string) => {
  const property = await Property.findById(id);
  return flattenProperty(property);
};

export const getSimilarProperties = async (id: string) => {
  const property = await Property.findById(id);
  if (!property) return [];

  const similar = await Property.find({
    "properties.type": property.properties.type,
    _id: { $ne: id },
  }).limit(3);

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

  // Although checking if the agent owns the property is good practice,
  // for now we might allow admins to edit all properties or check ownership here.
  // Assuming agent can only edit their own properties:
  if (property.agentId && property.agentId.toString() !== agentId) {
    throw new Error("Not authorized to update this property");
  }

  // If properties was not originally created with agentId (legacy data),
  // we might need a policy. For now, strict check if agentId exists on property.

  return await Property.findByIdAndUpdate(id, propertyData, { new: true });
};

export const getAgentProperties = async (agentId: string) => {
  return await Property.find({ agentId });
};

export const getDashboardStats = async (agentId: string) => {
  const totalProperties = await Property.countDocuments({ agentId });
  const recentProperties = await Property.find({ agentId })
    .sort({ createdAt: -1 })
    .limit(5);

  // For "users listed", assuming the requirement "agent can see users listed"
  // means all users in the system or users related to the agent.
  // Based on the prompt "agent can see users listed totoal property recent property",
  // it implies a general view or users contacted.
  // I'll include totalUsers count here as well if needed, but we have a separate route for users.
  const totalUsers = await User.countDocuments({ role: "CLIENT" }); // Count only clients maybe?

  return {
    totalProperties,
    recentProperties,
    totalUsers,
  };
};

export const deleteProperty = async (id: string, agentId: string) => {
  const property = await Property.findById(id);
  if (!property) throw new Error("Property not found");

  // Check if the agent owns the property
  if (property.agentId && property.agentId.toString() !== agentId) {
    throw new Error("Not authorized to delete this property");
  }

  return await Property.findByIdAndDelete(id);
};

export const bulkDeleteProperties = async (ids: string[], agentId: string) => {
  // Find all properties and verify ownership
  const properties = await Property.find({ _id: { $in: ids } });

  // Check if all properties belong to the agent
  const unauthorized = properties.some(
    (property) => property.agentId && property.agentId.toString() !== agentId,
  );

  if (unauthorized) {
    throw new Error("Not authorized to delete one or more properties");
  }

  return await Property.deleteMany({ _id: { $in: ids }, agentId });
};
