import { api } from "./api";
import type { User as UserType } from "../types";
import type { Property } from "./propertyApi";

export interface DashboardStats {
  totalProperties: number;
  recentProperties: Property[];
  totalUsers: number;
  totalInterests: number;
  pendingInterests: number;
  closedInterests: number;
  monthlyInterests: { _id: { month: number; year: number }; count: number }[];
  propertiesByType: { _id: string; count: number }[];
}

export const agentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/properties/agent/stats",
      providesTags: ["DashboardStats"],
    }),
    getAgentProperties: builder.query<Property[], void>({
      query: () => "/properties/agent/properties",
      providesTags: ["AgentProperties"],
    }),
    getUsers: builder.query<UserType[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createProperty: builder.mutation<Property, FormData>({
      query: (formData) => ({
        url: "/properties",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    updateProperty: builder.mutation<
      Property,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    deleteProperty: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    bulkDeleteProperties: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: "/properties/bulk",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    getAgentFavorites: builder.query<
      { property: Property; users: UserType[] }[],
      void
    >({
      query: () => "/properties/agent/favorites",
      providesTags: ["Property"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAgentPropertiesQuery,
  useGetUsersQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useBulkDeletePropertiesMutation,
  useGetAgentFavoritesQuery,
} = agentApi;
