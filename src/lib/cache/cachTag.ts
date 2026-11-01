export const CACHE_TAGS = {
    users: "users",
    user: (id: string) => `user-${id}`,
} as const;