"use server";
import authService from "@/services/auth.sevices";

export const getSession = async () => {
    const data = await authService.getSession();
    return await data
}