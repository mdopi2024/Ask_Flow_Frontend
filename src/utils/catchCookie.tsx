"use server"
import { cookies } from "next/headers"


export const cookie = async () => {
    const cookieStore = await cookies()
    return cookieStore.toString()
}