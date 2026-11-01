import axios from "axios";
import { env } from "../../env";

export const api = axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});