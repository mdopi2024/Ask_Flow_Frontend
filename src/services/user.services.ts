import "server-only";
import { ApiResponse, GetAllUsersParams, Role } from "@/types/auth.types";
import { cachedGet } from "@/lib/cache/cached.request";
import { CACHE_TAGS } from "@/lib/cache/cachTag";
import { cookie } from "@/utils/catchCookie";
import { api } from "@/lib/api";

const userService = {
    getAllUsers: (params: GetAllUsersParams = {}) =>
        cachedGet<ApiResponse>({
            url: "/auth/users",
            params,
            tags: [CACHE_TAGS.users],
        }),
    updateUserRole: async (userId: string, role: Role) => {
        const cookieHeader = await cookie();

        const { data } = await api.patch<ApiResponse>(
            `/auth/user/${userId}`,
            { role },
            { headers: { Cookie: cookieHeader } }
        );

        return data;
    },

};

export default userService;