import mongoose, { Schema, type Document } from "mongoose";

// Define the GeoJSON Point schema
const PointSchema = new Schema({
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
const PropertyDetailsSchema = new Schema({
  id: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String },
  community_name: { type: String },
  bedrooms_total: { type: Number },
  bathroom_total: { type: Number },
  price: { type: Number, required: true },
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
const PropertySchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for now as some properties might not have agents
    },
  },
  { timestamps: true },
);

// Create a 2dsphere index on the geometry field for geospatial queries
PropertySchema.index({ geometry: "2dsphere" });

// Create a text index on relevant fields for text search
PropertySchema.index({
  "properties.city": "text",
  "properties.street_address": "text",
  "properties.postal_code": "text",
  "properties.type": "text",
});

export interface IProperty extends Document {
  type: string;
  properties: {
    id: string;
    city: string;
    province: string;
    postal_code: string;
    community_name: string | null;
    bedrooms_total: number;
    bathroom_total: number;
    price: number;
    type: string;
    transaction_type: string;
    last_updated: number;
    street_address: string;
    sizeInterior: string;
    lease: string;
    latitude: number;
    longitude: number;
    listing_id: string;
    photo_url: string;
    all_photos?: Map<string, string>;
    description?: string;
    year_built?: string;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
  agentId?: mongoose.Types.ObjectId;
}

// Create or retrieve the model
const Property =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
