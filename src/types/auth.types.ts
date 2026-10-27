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

export interface AuthData {
    user: AuthUser;
    accessToken?: string;
}