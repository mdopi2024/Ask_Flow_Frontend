import { createAuthClient } from "better-auth/react"
import { env } from "../../env"
export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000",
    trustedOrigins: true,
})