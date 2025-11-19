import Property from "../models/property.model";
import User from "../models/user.model";
import { ParsedQs } from "qs";

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
    filter["properties.price"] = { ...filter["properties.price"], $lte: maxPrice };
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

  return { properties, totalCount };
};

export const getPropertyById = async (id: string) => {
  return Property.findById(id);
};

export const getSimilarProperties = async (id: string) => {
  const property = await Property.findById(id);
  if (!property) return [];

  return Property.find({
    "properties.type": property.properties.type,
    _id: { $ne: id },
  }).limit(3);
};

export const addToWishlist = async (userId: string, propertyId: string) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedHomes: propertyId } },
    { new: true }
  );
};

export const removeFromWishlist = async (
  userId: string,
  propertyId: string
) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { savedHomes: propertyId } },
    { new: true }
  );
};
