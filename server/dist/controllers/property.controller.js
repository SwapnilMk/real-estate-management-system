"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteProperties = exports.deleteProperty = exports.getDashboardStats = exports.getAgentProperties = exports.updateProperty = exports.createProperty = exports.removeFromWishlist = exports.addToWishlist = exports.getSimilarProperties = exports.getPropertyById = exports.getProperties = void 0;
const property_service_1 = require("../services/property.service");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const getProperties = async (req, res) => {
    try {
        const properties = await (0, property_service_1.getProperties)(req.query);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching properties" });
    }
};
exports.getProperties = getProperties;
const getPropertyById = async (req, res) => {
    try {
        const property = await (0, property_service_1.getPropertyById)(req.params.id);
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching property" });
    }
};
exports.getPropertyById = getPropertyById;
const getSimilarProperties = async (req, res) => {
    try {
        const properties = await (0, property_service_1.getSimilarProperties)(req.params.id);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching similar properties" });
    }
};
exports.getSimilarProperties = getSimilarProperties;
const addToWishlist = async (req, res) => {
    try {
        const user = await (0, property_service_1.addToWishlist)(req.user.id, req.params.id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding to wishlist" });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const user = await (0, property_service_1.removeFromWishlist)(req.user.id, req.params.id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error removing from wishlist" });
    }
};
exports.removeFromWishlist = removeFromWishlist;
const createProperty = async (req, res) => {
    try {
        let photoUrl = "";
        if (req.file) {
            const result = await (0, upload_middleware_1.uploadToCloudinary)(req.file);
            photoUrl = result.secure_url;
        }
        const propertyData = req.body;
        // Since body is multipart/form-data, nested objects might need parsing if sent as JSON strings
        // However, if the frontend sends flat fields, we need to structure it according to Property model.
        // The Property model expects a GeoJSON structure.
        // We need to map the input data to the schema.
        const { id, city, province, postal_code, community_name, bedrooms_total, bathroom_total, price, type, transaction_type, street_address, sizeInterior, lease, latitude, longitude, description, year_built, } = propertyData;
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
        const newProperty = await (0, property_service_1.createProperty)(formattedProperty, req.user.id);
        res.status(201).json(newProperty);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating property" });
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res) => {
    try {
        const propertyData = req.body;
        // Handle file upload if new image provided
        if (req.file) {
            const result = await (0, upload_middleware_1.uploadToCloudinary)(req.file);
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
        const updateObj = {};
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
        const updatedProperty = await (0, property_service_1.updateProperty)(req.params.id, { $set: updateObj }, req.user.id);
        res.json(updatedProperty);
    }
    catch (error) {
        console.error(error);
        if (error.message === "Not authorized to update this property") {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error updating property" });
        }
    }
};
exports.updateProperty = updateProperty;
const getAgentProperties = async (req, res) => {
    try {
        const properties = await (0, property_service_1.getAgentProperties)(req.user.id);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching agent properties" });
    }
};
exports.getAgentProperties = getAgentProperties;
const getDashboardStats = async (req, res) => {
    try {
        const stats = await (0, property_service_1.getDashboardStats)(req.user.id);
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
};
exports.getDashboardStats = getDashboardStats;
const deleteProperty = async (req, res) => {
    try {
        await (0, property_service_1.deleteProperty)(req.params.id, req.user.id);
        res.json({ message: "Property deleted successfully" });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Not authorized to delete this property") {
            res.status(403).json({ message: error.message });
        }
        else if (error.message === "Property not found") {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error deleting property" });
        }
    }
};
exports.deleteProperty = deleteProperty;
const bulkDeleteProperties = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid property IDs" });
        }
        await (0, property_service_1.bulkDeleteProperties)(ids, req.user.id);
        res.json({ message: `${ids.length} properties deleted successfully` });
    }
    catch (error) {
        console.error(error);
        if (error.message === "Not authorized to delete one or more properties") {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error deleting properties" });
        }
    }
};
exports.bulkDeleteProperties = bulkDeleteProperties;
