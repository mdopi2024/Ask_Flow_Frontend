"use client";

import { useRouter } from "next/navigation";
import { buildFormsHref } from "./FormQuery";
import { FormsQuery, LIMIT_OPTIONS } from "./Form.queary";


export function FormsPageSize({ query }: { query: FormsQuery }) {
    const router = useRouter();

    return (
        <label className="flex items-center gap-2 text-muted-foreground">
            <span>Rows per page</span>
            <select
                value={query.limit}
                onChange={(e) =>
                    router.replace(buildFormsHref({ ...query, limit: Number(e.target.value), page: 1 }), { scroll: false })
                }
                className="h-8 rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none hover:border-ring/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
                {LIMIT_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
        </label>
    );
}