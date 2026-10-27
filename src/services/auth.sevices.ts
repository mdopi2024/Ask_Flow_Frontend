import { ApiResponse, AuthData, SignInPayload, SignUpPayload } from "@/types/auth.types";
import { cookie } from "@/utils/catchCookie";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:5000/api/v1";
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

const authService = {
    signUp: async (payload: SignUpPayload): Promise<ApiResponse<AuthData>> => {
        const { data } = await api.post<ApiResponse<AuthData>>("/auth/signup", payload);
        return data;
    },

    signIn: async (payload: SignInPayload): Promise<ApiResponse<AuthData>> => {
        const { data } = await api.post<ApiResponse<AuthData>>("/auth/signin", payload);
        return data;
    },

    signOut: async (): Promise<ApiResponse> => {
        const { data } = await api.post<ApiResponse>("/auth/signout");
        return data;
    },


};

export default authService