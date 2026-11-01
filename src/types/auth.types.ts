export interface SignUpPayload {
    name: string;
    email: string;
    password: string;
}

export interface SignInPayload {
    email: string;
    password: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export enum Role {
    ADMIN,
    USER
}
export type GetAllUsersParams = {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: Role; // use your roleEnum's inferred type
    sortBy?: "createdAt" | "name" | "email" | "role";
    sortOrder?: "asc" | "desc";
};

export interface AuthData {
    user: AuthUser;
    accessToken?: string;
}