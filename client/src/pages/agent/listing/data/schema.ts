import { z } from "zod";

export const propertySchema = z.object({
  id: z.string(),
  _id: z.string(),
  listing_id: z.string(),
  street_address: z.string(),
  city: z.string(),
  province: z.string(),
  postal_code: z.string().optional(),
  community_name: z.string().optional().nullable(),
  bedrooms_total: z.number().optional(),
  bathroom_total: z.number().optional(),
  price: z.number(),
  type: z.string(),
  transaction_type: z.string(),
  last_updated: z.number(),
  sizeInterior: z.string().optional(),
  lease: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photo_url: z.string().optional(),
  description: z.string().optional(),
  year_built: z.string().optional(),
  agentId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Property = z.infer<typeof propertySchema>;
