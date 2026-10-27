// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//     server: {
//         FRONTEND_URL: z.url(),
//         BACKENE_URL: z.url(),
//         API_URL: z.url(),
//         AUTH_URL: z.url(),
//     },

//     client: {
//         NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().min(1),
//         NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().min(1),
//         NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().min(1),
//     },

//     runtimeEnv: {
//         FRONTEND_URL: process.env.FRONTEND_URL,
//         BACKENE_URL: process.env.BACKENE_URL,
//         API_URL: process.env.API_URL,
//         AUTH_URL: process.env.AUTH_URL,

//         NEXT_PUBLIC_EMAILJS_SERVICE_ID:
//             process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
//         NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
//             process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
//         NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:
//             process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
//     },
// });