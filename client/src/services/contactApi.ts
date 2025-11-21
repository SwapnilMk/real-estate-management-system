import { api } from "./api";

// Request type
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Response type
export interface ContactResponse {
  success: boolean;
  message: string;
}

// Contact message type
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "read" | "responded";
  createdAt: string;
  updatedAt: string;
}

// Get all contacts response
export interface GetContactsResponse {
  success: boolean;
  data: ContactMessage[];
  count: number;
}

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<ContactResponse, ContactRequest>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    getContactMessages: builder.query<GetContactsResponse, void>({
      query: () => ({
        url: "/contacts",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
  }),
});

// Export hooks
export const { useSendContactMessageMutation, useGetContactMessagesQuery } =
  contactApi;
