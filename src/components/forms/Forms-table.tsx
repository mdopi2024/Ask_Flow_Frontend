import Link from "next/link";
import { ChevronLeft, ChevronRight, FileSearch } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { Form } from "@/types/forms.types";
import { FormsQuery } from "./Form.queary";
import { CopySlugButton } from "./CopySlog";
import { FormRowActions } from "./formRowAciton";
import { FormsPageSize } from "./formPageSize";
import { buildFormsHref } from "./FormQuery";


type Meta = { page: number; limit: number; total: number; totalPages: number };

type FormRow = Omit<Form, "owner" | "_count"> & {
    owner?: { name?: string | null; email?: string | null } | null;
    _count?: { questions?: number; responses?: number } | null;
};

const statusStyles: Record<string, string> = {
    PUBLISHED: "bg-success-soft text-success-foreground",
    DRAFT: "bg-warning-soft text-warning-foreground",
    UNPUBLISHED: "bg-muted text-muted-foreground",
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatDate = (d?: string | Date | null) => (d ? dateFmt.format(new Date(d)) : null);

export function FormsTable({ items, meta, query }: { items: FormRow[]; meta: Meta; query: FormsQuery }) {
    const hasFilters = Boolean(query.search || query.status);
    const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const to = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="pl-4">Form</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="pr-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="h-56">
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                    <FileSearch className="size-8 text-muted-foreground" aria-hidden />
                                    <p className="font-medium">
                                        {hasFilters ? "No forms match your filters" : "No forms yet"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {hasFilters ? "Try a different search term or status." : "Forms you create will show up here."}
                                    </p>
                                    {hasFilters && (
                                        <Link href="?" className="mt-1 text-sm font-medium text-primary hover:underline">
                                            Clear filters
                                        </Link>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((form) => {
                            const status = String(form.status).toUpperCase();
                            const created = formatDate(form.createdAt);
                            const published = formatDate(form.publishedAt);

                            return (
                                <TableRow key={form.id}>
                                    <TableCell className="max-w-[20rem] pl-4">
                                        <Link
                                            href={`/dashboard/forms/${form.id}`}
                                            className="block truncate font-medium hover:text-primary"
                                        >
                                            {form.title}
                                        </Link>
                                        <div className="flex items-center gap-1">
                                            <p className="truncate font-mono text-xs text-muted-foreground">{form.slug}</p>
                                            <CopySlugButton slug={form.slug} />
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                                statusStyles[status] ?? "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <span className="size-1.5 rounded-full bg-current" aria-hidden />
                                            {status.toLowerCase()}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <p className="text-sm">{form.owner?.name ?? "—"}</p>
                                        {form.owner?.email && (
                                            <p className="text-xs text-muted-foreground">{form.owner.email}</p>
                                        )}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap">
                                        <p className="text-sm">{created ?? "—"}</p>
                                        {published && <p className="text-xs text-muted-foreground">Published {published}</p>}
                                    </TableCell>

                                    <TableCell className="pr-4">
                                        <FormRowActions
                                            formId={form.id}
                                            title={form.title}
                                            questionsCount={form._count?.questions ?? 0}
                                            responsesCount={form._count?.responses ?? 0}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
                        <span className="font-medium text-foreground">{meta.total}</span>
                    </span>
                    <FormsPageSize query={query} />
                </div>

                <div className="flex items-center gap-2">
                    <span className="mr-1 text-muted-foreground">
                        Page {meta.page} of {Math.max(meta.totalPages, 1)}
                    </span>
                    <PageLink disabled={meta.page <= 1} href={buildFormsHref({ ...query, page: meta.page - 1 })} label="Previous page">
                        <ChevronLeft className="size-4" aria-hidden /> Previous
                    </PageLink>
                    <PageLink disabled={meta.page >= meta.totalPages} href={buildFormsHref({ ...query, page: meta.page + 1 })} label="Next page">
                        Next <ChevronRight className="size-4" aria-hidden />
                    </PageLink>
                </div>
            </div>
        </div>
    );
}

function PageLink({
    href, disabled, label, children,
}: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
    const base = "inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-sm";
    if (disabled)
        return (
            <span aria-disabled="true" aria-label={label} className={cn(base, "cursor-not-allowed opacity-50")}>
                {children}
            </span>
        );
    return (
        <Link href={href} aria-label={label} className={cn(base, "transition-colors hover:bg-accent hover:text-accent-foreground")}>
            {children}
        </Link>
    );
}