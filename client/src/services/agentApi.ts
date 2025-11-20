import { api } from "./api";

export interface DashboardStats {
  totalProperties: number;
  recentProperties: any[];
  totalUsers: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

export const agentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/properties/agent/stats",
      providesTags: ["DashboardStats"],
    }),
    getAgentProperties: builder.query<any[], void>({
      query: () => "/properties/agent/properties",
      providesTags: ["AgentProperties"],
    }),
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createProperty: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/properties",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    updateProperty: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    deleteProperty: builder.mutation<any, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
    }),
    bulkDeleteProperties: builder.mutation<any, string[]>({
      query: (ids) => ({
        url: "/properties/bulk",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["AgentProperties", "DashboardStats"],
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
} = agentApi;
