"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the GeoJSON Point schema
const PointSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});
// Define the property details schema
const PropertyDetailsSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postal_code: { type: String },
    community_name: { type: String },
    bedrooms_total: { type: String },
    bathroom_total: { type: String },
    price: { type: String, required: true },
    type: { type: String },
    transaction_type: { type: String },
    last_updated: { type: Number },
    street_address: { type: String, required: true },
    sizeInterior: { type: String },
    lease: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    listing_id: { type: String },
    photo_url: { type: String },
    all_photos: { type: Map, of: String },
    description: { type: String },
    year_built: { type: String },
});
// Define the main property schema (GeoJSON Feature)
const PropertySchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["Feature"],
        required: true,
    },
    properties: {
        type: PropertyDetailsSchema,
        required: true,
    },
    geometry: {
        type: PointSchema,
        required: true,
    },
    agentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Optional for now as some properties might not have agents
    },
}, { timestamps: true });
// Create a 2dsphere index on the geometry field for geospatial queries
PropertySchema.index({ geometry: "2dsphere" });
// Create a text index on relevant fields for text search
PropertySchema.index({
    "properties.city": "text",
    "properties.street_address": "text",
    "properties.postal_code": "text",
    "properties.type": "text",
});
// Create or retrieve the model
const Property = mongoose_1.default.models.Property ||
    mongoose_1.default.model("Property", PropertySchema);
exports.default = Property;
