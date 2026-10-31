import { ApiResponse, AuthData, SignInPayload, SignUpPayload } from "@/types/auth.types";
import axios from "axios";
import { env } from "../../env";
import { cookie } from "@/utils/catchCookie";

const envUrl = env

const BASE_URL = envUrl.NEXT_PUBLIC_BACKEND_API_URL;
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

const authService = {
    getSession: async () => {
        try {
            const res = await axios.get(
                `${envUrl.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/get-session`,
                {
                    headers: {
                        Cookie: await cookie(),
                    },
                }
            );

            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("session error:", error.response?.status, error.response?.data);
            }
            return null;
        }
    },
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