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

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<ContactResponse, ContactRequest>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hook
export const { useSendContactMessageMutation } = contactApi;
