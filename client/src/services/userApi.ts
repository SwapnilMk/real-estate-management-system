import { api } from "./api";
import type { User } from "@/types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<
      User,
      { name?: string; email?: string; phoneNumber?: string; avatar?: File }
    >({
      query: (data) => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
        if (data.avatar) formData.append("avatar", data.avatar);

        return {
          url: "/users/profile",
          method: "PUT",
          body: formData,
        };
      },
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/users/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateUserProfileMutation, useChangePasswordMutation } =
  userApi;
