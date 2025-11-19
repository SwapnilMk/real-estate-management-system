// src/services/propertyApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Property {
  id: string;
  listing_id: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  price: string;
  bedrooms_total: string;
  bathroom_total: string;
  type: string;
  photo_url: string;
  sizeInterior?: string;
  year_built?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  all_photos?: Record<string, string>;
  interiorFeatures?: string[];
  exteriorFeatures?: string[];
}

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  tagTypes: ["Property", "Similar"],
  endpoints: (builder) => ({
    getProperties: builder.query<
      {
        properties: Property[];
        totalCount: number;
      },
      {
        page?: number;
        limit?: number;
        type?: string;
        minPrice?: string;
        maxPrice?: string;
        beds?: string;
        propertyType?: string;
        bounds?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.type) searchParams.append("type", params.type);
        if (params.minPrice) searchParams.append("minPrice", params.minPrice);
        if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice);
        if (params.beds) searchParams.append("beds", params.beds);
        if (params.propertyType)
          searchParams.append("propertyType", params.propertyType);
        if (params.bounds) searchParams.append("bounds", params.bounds);

        return `/properties?${searchParams.toString()}`;
      },
    }),
    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
    }),
    getSimilarProperties: builder.query<Property[], string>({
      query: (id) => `/properties/similar?id=${id}`,
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
} = propertyApi;
