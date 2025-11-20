import { z } from "zod";

export const propertySchema = z.object({
  _id: z.string(),
  type: z.literal("Feature"),
  properties: z.object({
    id: z.string(),
    city: z.string(),
    province: z.string(),
    postal_code: z.string().optional(),
    community_name: z.string().optional().nullable(),
    bedrooms_total: z.string().optional(),
    bathroom_total: z.string().optional(),
    price: z.string(),
    type: z.string(),
    transaction_type: z.string(),
    last_updated: z.number(),
    street_address: z.string(),
    sizeInterior: z.string().optional(),
    lease: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    listing_id: z.string(),
    photo_url: z.string().optional(),
    description: z.string().optional(),
    year_built: z.string().optional(),
  }),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()),
  }),
  agentId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Property = z.infer<typeof propertySchema>;
