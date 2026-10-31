"use server";
import authService from "@/services/auth.sevices";

export const getSession = async () => {
    return await authService.getSession();

}