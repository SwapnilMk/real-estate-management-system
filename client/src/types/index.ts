export type Role = "CLIENT" | "AGENT";

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
