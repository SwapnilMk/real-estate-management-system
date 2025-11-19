import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "AGENT";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthModalOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthModalOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { setCredentials, logout, openAuthModal, closeAuthModal } =
  authSlice.actions;
export default authSlice.reducer;
