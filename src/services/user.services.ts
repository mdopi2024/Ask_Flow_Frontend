import "server-only";
import { ApiResponse, GetAllUsersParams } from "@/types/auth.types";
import { cachedGet } from "@/lib/cache/cached.request";
import { CACHE_TAGS } from "@/lib/cache/cachTag";

const userService = {
    getAllUsers: (params: GetAllUsersParams = {}) =>
        cachedGet<ApiResponse>({
            url: "/auth/users",
            params,
            tags: [CACHE_TAGS.users],
        }),
};

export default userService;