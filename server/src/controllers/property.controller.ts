import { Request, Response } from "express";
import {
  getProperties as getPropertiesService,
  getPropertyById as getPropertyByIdService,
  getSimilarProperties as getSimilarPropertiesService,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  createProperty as createPropertyService,
  updateProperty as updatePropertyService,
  getAgentProperties as getAgentPropertiesService,
  getDashboardStats as getDashboardStatsService,
} from "../services/property.service";
import { uploadToCloudinary } from "../middlewares/upload.middleware";

export const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getPropertiesService(req.query);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await getPropertyByIdService(req.params.id);
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property" });
  }
};

export const getSimilarProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getSimilarPropertiesService(req.params.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching similar properties" });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const user = await addToWishlistService(req.user.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const user = await removeFromWishlistService(req.user.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    let photoUrl = "";
    if (req.file) {
      const result: any = await uploadToCloudinary(req.file);
      photoUrl = result.secure_url;
    }

    const propertyData = req.body;

    // Since body is multipart/form-data, nested objects might need parsing if sent as JSON strings
    // However, if the frontend sends flat fields, we need to structure it according to Property model.
    // The Property model expects a GeoJSON structure.
    // We need to map the input data to the schema.

    const {
      id,
      city,
      province,
      postal_code,
      community_name,
      bedrooms_total,
      bathroom_total,
      price,
      type,
      transaction_type,
      street_address,
      sizeInterior,
      lease,
      latitude,
      longitude,
      description,
      year_built,
    } = propertyData;

    const formattedProperty = {
      type: "Feature",
      properties: {
        id: id || `prop_${Date.now()}`, // Generate ID if not provided
        city,
        province,
        postal_code,
        community_name,
        bedrooms_total,
        bathroom_total,
        price,
        type,
        transaction_type,
        last_updated: Date.now(),
        street_address,
        sizeInterior,
        lease,
        latitude: Number(latitude),
        longitude: Number(longitude),
        listing_id: `L${Date.now()}`,
        photo_url: photoUrl,
        description,
        year_built,
      },
      geometry: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    };

    const newProperty = await createPropertyService(
      formattedProperty,
      req.user.id,
    );
    res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating property" });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const propertyData = req.body;

    // Handle file upload if new image provided
    if (req.file) {
      const result: any = await uploadToCloudinary(req.file);
      // We need to update the photo_url in the properties object
      // The structure of update depends on how we receive data.
      // Assuming we receive fields to update.

      // If we are updating, we need to reconstruct the nested structure or use dot notation.
      // Using dot notation for MongoDB updates is safer.
      propertyData["properties.photo_url"] = result.secure_url;
    }

    // Mongoose findByIdAndUpdate with flat keys for nested objects requires flattened keys.
    // Or we can merge the data.
    // For simplicity, let's assume we construct the update object.

    const updateObj: any = {};
    const nestedFields = [
      "city",
      "province",
      "postal_code",
      "community_name",
      "bedrooms_total",
      "bathroom_total",
      "price",
      "type",
      "transaction_type",
      "street_address",
      "sizeInterior",
      "lease",
      "latitude",
      "longitude",
      "description",
      "year_built",
    ];

    nestedFields.forEach((field) => {
      if (propertyData[field] !== undefined) {
        updateObj[`properties.${field}`] = propertyData[field];
      }
    });

    if (propertyData["properties.photo_url"]) {
      updateObj["properties.photo_url"] = propertyData["properties.photo_url"];
    }

    if (propertyData.latitude && propertyData.longitude) {
      updateObj.geometry = {
        type: "Point",
        coordinates: [
          Number(propertyData.longitude),
          Number(propertyData.latitude),
        ],
      };
    }

    const updatedProperty = await updatePropertyService(
      req.params.id,
      { $set: updateObj },
      req.user.id,
    );
    res.json(updatedProperty);
  } catch (error: any) {
    console.error(error);
    if (error.message === "Not authorized to update this property") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error updating property" });
    }
  }
};

export const getAgentProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getAgentPropertiesService(req.user.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent properties" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
