import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL?.replace("/api/v1", "") ??
        "http://localhost:5000",
    trustedOrigins: [process.env.NEXT_PUBLIC_FRONTEND_URL!],
})