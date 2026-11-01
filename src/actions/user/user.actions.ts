"use server";

import { CACHE_TAGS } from "@/lib/cache/cachTag";
import authService from "@/services/auth.sevices";
import userService from "@/services/user.services";
import { GetAllUsersParams, SignInPayload, SignUpPayload } from "@/types/auth.types";
import { updateTag } from "next/cache";

export const getSession = async () => {
    return await authService.getSession();
};


export const getAllUser = async (params: GetAllUsersParams = {}) => {
    return await userService.getAllUsers(params);
};

export const refreshUsers = async () => {
    updateTag(CACHE_TAGS.users);
};