export type UserRole = "USER" | "ADMIN";

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    role: UserRole;
    username: string;
    email: string;
}