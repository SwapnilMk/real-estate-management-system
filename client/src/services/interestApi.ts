import { api } from "./api";

export interface Interest {
  _id: string;
  propertyId: {
    _id: string;
    properties: {
      street_address: string;
      city: string;
      price: number;
      photo_url: string;
    };
  };
  clientId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  agentId: string;
  message?: string;
  status: "pending" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export const interestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createInterest: builder.mutation<
      Interest,
      { propertyId: string; message: string }
    >({
      query: ({ propertyId, message }) => ({
        url: `/properties/${propertyId}/interest`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Interest"],
    }),
    getClientInterests: builder.query<Interest[], void>({
      query: () => "/client/interests",
      providesTags: ["Interest"],
    }),
    getAgentInterests: builder.query<Interest[], { status?: string } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        return `/agent/interests?${searchParams.toString()}`;
      },
      providesTags: ["Interest"],
    }),
    updateInterestStatus: builder.mutation<
      Interest,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/agent/interests/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Interest"],
    }),
    deleteInterest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/interests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Interest"],
    }),
  }),
});

export const {
  useCreateInterestMutation,
  useGetClientInterestsQuery,
  useGetAgentInterestsQuery,
  useUpdateInterestStatusMutation,
  useDeleteInterestMutation,
} = interestApi;
