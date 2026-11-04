// Shared by the page (server) and the toolbar (client). No "use client" here on purpose.

export const MIN_LIMIT = 10;
export const MAX_LIMIT = 100;
export const LIMIT_OPTIONS = [10, 25, 50, 100] as const;

export const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "PUBLISHED", label: "Published" },
    { value: "DRAFT", label: "Draft" },
    { value: "UNPUBLISHED", label: "Unpublished" },
] as const;

export const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
] as const;

export type FormStatusValue = "PUBLISHED" | "DRAFT" | "UNPUBLISHED";

export type RawSearchParams = {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    sort?: string;
};

export type FormsQuery = {
    page: number;
    limit: number;
    search?: string;
    status?: FormStatusValue;
    sort: "newest" | "oldest";
};

export function parseFormsQuery(sp: RawSearchParams): FormsQuery {
    const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, parseInt(sp.limit ?? "10", 10) || MIN_LIMIT));

    const status = sp.status?.toUpperCase();
    const validStatus =
        status === "PUBLISHED" || status === "DRAFT" || status === "UNPUBLISHED" ? status : undefined;

    return {
        page,
        limit,
        search: sp.search?.trim() || undefined,
        status: validStatus,
        sort: sp.sort === "oldest" ? "oldest" : "newest",
    };
}