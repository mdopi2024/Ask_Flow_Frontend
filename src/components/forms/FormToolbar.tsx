"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseFormsQuery, SORT_OPTIONS, STATUS_OPTIONS } from "./Form.queary";


const field =
    "h-9 rounded-md border border-input bg-card px-3 text-sm outline-none transition-colors hover:border-ring/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export function FormsToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Parsed exactly like the server does, so the UI shows what is really applied.
    const q = parseFormsQuery(Object.fromEntries(searchParams));
    const [search, setSearch] = useState(q.search ?? "");

    function update(patch: Record<string, string | undefined>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [k, v] of Object.entries(patch)) {
            if (v) params.set(k, v);
            else params.delete(k);
        }
        params.delete("page"); // any filter change goes back to page 1
        const qs = params.toString();
        startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    }

    // Debounced search
    useEffect(() => {
        const next = search.trim();
        if (next === (q.search ?? "")) return;
        const t = setTimeout(() => update({ search: next || undefined }), 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const hasFilters = Boolean(q.search || q.status || q.sort !== "newest");

    function clearAll() {
        setSearch("");
        update({ search: undefined, status: undefined, sort: undefined });
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, slug or description"
                    aria-label="Search forms"
                    className={cn(field, "w-full pl-9 pr-9")}
                />
                {isPending && (
                    <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
                )}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
                <div role="group" aria-label="Filter by status" className="inline-flex rounded-md border border-input bg-card p-0.5">
                    {STATUS_OPTIONS.map((opt) => {
                        const active = (q.status ?? "") === opt.value;
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                aria-pressed={active}
                                onClick={() => update({ status: opt.value || undefined })}
                                className={cn(
                                    "rounded px-3 py-1 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary-soft text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                <select
                    aria-label="Sort forms"
                    value={q.sort}
                    onChange={(e) => update({ sort: e.target.value === "newest" ? undefined : e.target.value })}
                    className={field}
                >
                    {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" aria-hidden /> Clear
                    </button>
                )}
            </div>
        </div>
    );
}