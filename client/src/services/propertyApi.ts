// src/services/propertyApi.ts
import { api } from "./api";

export interface Property {
  id: string;
  _id: string;
  listing_id: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  price: number;
  bedrooms_total: number;
  bathroom_total: number;
  type: string;
  transaction_type: string;
  last_updated: number;
  photo_url: string;
  sizeInterior?: string;
  year_built?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  all_photos?: Record<string, string>;
  interiorFeatures?: string[];
  exteriorFeatures?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const propertyApi = api.injectEndpoints({
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
      providesTags: ["Property"],
    }),
    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Property", id }],
    }),
    getSimilarProperties: builder.query<Property[], string>({
      query: (id) => `/properties/similar?id=${id}`,
      providesTags: ["Similar"],
    }),
    addToWishlist: builder.mutation<void, string>({
      query: (propertyId) => ({
        url: `/properties/wishlist/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
      async onQueryStarted(propertyId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          propertyApi.util.updateQueryData(
            "getUserWishlist",
            undefined,
            (draft) => {
              // Optimistically add to wishlist (using a partial object casted to Property)
              // We only need the ID for the map-search page to update the icon
              if (!draft.find((p) => p.id === propertyId)) {
                draft.push({ id: propertyId } as Property);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeFromWishlist: builder.mutation<void, string>({
      query: (propertyId) => ({
        url: `/properties/wishlist/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
      async onQueryStarted(propertyId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          propertyApi.util.updateQueryData(
            "getUserWishlist",
            undefined,
            (draft) => {
              return draft.filter((p) => p.id !== propertyId);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getUserWishlist: builder.query<Property[], void>({
      query: () => "/properties/saved",
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserWishlistQuery,
} = propertyApi;
