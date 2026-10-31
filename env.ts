import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        FRONTEND_APP_URL: z.url(),


    },

    client: {
        NEXT_PUBLIC_BACKEND_BASE_URL: z.url(),
        NEXT_PUBLIC_BACKEND_API_URL: z.url(),
    },

    runtimeEnv: {
        FRONTEND_APP_URL: process.env.FRONTEND_APP_URL,
        NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
        NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,

    },
});