"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterValues = { search: string; status: string; sort: string };

const STATUS_TABS = [
    { value: "", label: "All" },
    { value: "PUBLISHED", label: "Published" },
    { value: "DRAFT", label: "Draft" },
    { value: "UNPUBLISHED", label: "Unpublished" },
];

// Page is omitted on purpose, so any filter change returns to page 1.
const toUrl = (v: FilterValues, limit?: number) => {
    const p = new URLSearchParams();
    if (v.search.trim()) p.set("search", v.search.trim());
    if (v.status) p.set("status", v.status);
    if (v.sort) p.set("sort", v.sort);
    if (limit) p.set("limit", String(limit));
    const qs = p.toString();
    return qs ? `/dashboard?${qs}` : "/dashboard";
};

export function FormsFilters({
    query,
}: {
    query: { search?: string; status?: string; sort?: string; limit?: number };
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const initial: FilterValues = {
        search: query.search ?? "",
        status: query.status ?? "",
        sort: query.sort ?? "newest",
    };
    const currentUrl = toUrl(initial, query.limit);

    const form = useForm({
        defaultValues: initial,
        onSubmit: ({ value }) => {
            const next = toUrl(value, query.limit);
            if (next === currentUrl) return;
            startTransition(() => router.replace(next));
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
            {/* Search: runs ~400ms after you stop typing */}
            <form.Field
                name="search"
                listeners={{ onChange: () => form.handleSubmit(), onChangeDebounceMs: 400 }}
            >
                {(field) => (
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                            placeholder="Search by title"
                            aria-label="Search forms"
                            className="h-10 rounded-lg bg-surface pl-9 pr-9"
                        />
                        {pending ? (
                            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        ) : field.state.value ? (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => field.handleChange("")}
                                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X className="size-4" />
                            </button>
                        ) : null}
                    </div>
                )}
            </form.Field>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <form.Field name="status" listeners={{ onChange: () => form.handleSubmit() }}>
                    {(field) => (
                        <div
                            role="radiogroup"
                            aria-label="Filter by status"
                            className="inline-flex max-w-full overflow-x-auto rounded-lg border border-primary/20 bg-primary-soft/50 p-0.5"
                        >
                            {STATUS_TABS.map((tab) => {
                                const active = field.state.value === tab.value;
                                return (
                                    <button
                                        key={tab.label}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => field.handleChange(tab.value)}
                                        className={cn(
                                            "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
                                            active
                                                ? "bg-primary-soft font-medium text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </form.Field>

                {/* Sort */}
                <form.Field name="sort" listeners={{ onChange: () => form.handleSubmit() }}>
                    {(field) => (
                        <select
                            aria-label="Sort forms"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="h-10 rounded-lg border border-input bg-surface px-3 text-sm font-medium text-foreground"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    )}
                </form.Field>
            </div>
        </form>
    );
}