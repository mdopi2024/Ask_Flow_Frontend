import "server-only";
import { api } from "@/lib/api";
import { cookie } from "@/utils/catchCookie";
import { cacheLife, cacheTag } from "next/cache";


const CACHE_PRESETS = {
    seconds: { stale: 0, revalidate: 1, expire: 60 },
    minutes: { stale: 60, revalidate: 60, expire: 300 },
    hours: { stale: 300, revalidate: 3600, expire: 86400 },
    days: { stale: 300, revalidate: 86400, expire: 604800 },
    weeks: { stale: 300, revalidate: 604800, expire: 2592000 },
    max: { stale: 300, revalidate: 2592000, expire: 31536000 },
} as const;

type CacheLife = keyof typeof CACHE_PRESETS;

type CachedGetOptions = {
    url: string;
    params?: Record<string, unknown>;
    cookieHeader: string;
    tags: string[];
    life?: CacheLife;
};

async function cachedGetInternal<T>({
    url,
    params,
    cookieHeader,
    tags,
    life = "minutes",
}: CachedGetOptions): Promise<T> {
    "use cache";
    cacheLife(CACHE_PRESETS[life]);
    tags.forEach((tag) => cacheTag(tag));

    const { data } = await api.get<T>(url, {
        params,
        headers: { Cookie: cookieHeader },
    });
    return data;
}

type GetOptions = Omit<CachedGetOptions, "cookieHeader">;

export async function cachedGet<T>(options: GetOptions): Promise<T> {
    const cookieHeader = await cookie();
    return cachedGetInternal<T>({ ...options, cookieHeader });
}