export type Role = "CLIENT" | "AGENT";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}
