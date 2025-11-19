import { api } from "./api";
import type { User } from "@/types";

type LoginResponse = {
    user: User;
    accessToken: string;
};

type RegisterResponse = LoginResponse;

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<
            RegisterResponse,
            { name: string; email: string; password: string; role?: string }
        >({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
        forgotPassword: builder.mutation<void, { email: string }>({
            query: ({ email }) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),
        resetPassword: builder.mutation<LoginResponse, { token: string; password: string }>({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${token}`,
                method: "POST",
                body: { password },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;