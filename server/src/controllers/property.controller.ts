import { Request, Response } from "express";
import {
  getProperties as getPropertiesService,
  getPropertyById as getPropertyByIdService,
  getSimilarProperties as getSimilarPropertiesService,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  getSavedProperties as getSavedPropertiesService,
  createProperty as createPropertyService,
  updateProperty as updatePropertyService,
  getAgentProperties as getAgentPropertiesService,
  getDashboardStats as getDashboardStatsService,
  deleteProperty as deletePropertyService,
  bulkDeleteProperties as bulkDeletePropertiesService,
  getAgentFavoritedProperties as getAgentFavoritedPropertiesService,
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
    const id = (req.query.id as string) || req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Property ID is required" });
    }
    const properties = await getSimilarPropertiesService(id);
    res.json(properties);
  } catch (error) {
    console.error("Error in getSimilarProperties:", error);
    res.status(500).json({ message: "Error fetching similar properties" });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const user = await addToWishlistService(req.user!.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const user = await removeFromWishlistService(req.user!.id, req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};

export const getSavedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getSavedPropertiesService(req.user!.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved properties" });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    let photoUrl = "";
    const allPhotos: Record<string, string> = {};

    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = (req.files as Express.Multer.File[]).map(
        async (file) => {
          const result: any = await uploadToCloudinary(file);
          return result.secure_url;
        },
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      if (uploadedUrls.length > 0) {
        photoUrl = uploadedUrls[0]; // Set the first image as the main photo
        uploadedUrls.forEach((url, index) => {
          allPhotos[`photo_${index + 1}`] = url;
        });
      }
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
        bedrooms_total: Number(bedrooms_total),
        bathroom_total: Number(bathroom_total),
        price: Number(price),
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
        all_photos: allPhotos,
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
      req.user!.id,
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
    const updateObj: any = {};

    // Handle file upload if new images provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = (req.files as Express.Multer.File[]).map(
        async (file) => {
          const result: any = await uploadToCloudinary(file);
          return result.secure_url;
        },
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      if (uploadedUrls.length > 0) {
        // Update main photo
        updateObj["properties.photo_url"] = uploadedUrls[0];

        // Update all_photos map.
        // Note: This replaces existing photos if we strictly follow this logic.
        // A more complex logic would be needed to append or replace specific indices.
        // For this implementation, we'll assume a full replace of the gallery if new images are sent,
        // or we could merge. Let's just set the new map for now.
        const allPhotos: Record<string, string> = {};
        uploadedUrls.forEach((url, index) => {
          allPhotos[`photo_${index + 1}`] = url;
        });
        updateObj["properties.all_photos"] = allPhotos;
      }
    }

    // Mongoose findByIdAndUpdate with flat keys for nested objects requires flattened keys.
    // Or we can merge the data.
    // For simplicity, let's assume we construct the update object.

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
      req.user!.id,
    );
    res.json(updatedProperty);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(err);
    if (err.message === "Not authorized to update this property") {
      res.status(403).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Error updating property" });
    }
  }
};

export const getAgentProperties = async (req: Request, res: Response) => {
  try {
    const properties = await getAgentPropertiesService(req.user!.id);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent properties" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService(req.user!.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    await deletePropertyService(req.params.id, req.user!.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    console.error(err);
    if (err.message === "Not authorized to delete this property") {
      res.status(403).json({ message: err.message });
    } else if (err.message === "Property not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Error deleting property" });
    }
  }
};

export const bulkDeleteProperties = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid property IDs" });
    }
    await bulkDeletePropertiesService(ids, req.user!.id);
    res.json({ message: `${ids.length} properties deleted successfully` });
  } catch (error: unknown) {
    const err = error as Error;
    console.error(err);
    if (err.message === "Not authorized to delete one or more properties") {
      res.status(403).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Error deleting properties" });
    }
  }
};

export const getAgentFavoritedProperties = async (
  req: Request,
  res: Response,
) => {
  try {
    const favorites = await getAgentFavoritedPropertiesService(req.user!.id);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching agent favorites" });
  }
};
