"use client";


import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    FileText,
    ListChecks,
    MessageSquareText,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormRow, FormStatusValue, ModalState, MyFormsResponse } from "@/types/forms.ui-types";
import { FormsFilters } from "./FormFilter";
import { FormModals } from "./FormModal";

const LIMIT_OPTIONS = [10, 20, 30];



const STATUS_STYLES: Record<FormStatusValue, string> = {
    PUBLISHED: "border-success/25 bg-success-soft text-success-foreground",
    DRAFT: "border-warning/30 bg-warning-soft text-warning-foreground",
    UNPUBLISHED: "border-border bg-muted text-muted-foreground",
};

const STATUS_DOT: Record<FormStatusValue, string> = {
    PUBLISHED: "bg-success",
    DRAFT: "bg-warning-foreground",
    UNPUBLISHED: "bg-muted-foreground",
};

function StatusPill({ status }: { status: FormStatusValue }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                STATUS_STYLES[status]
            )}
        >
            <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
            {status.toLowerCase()}
        </span>
    );
}

const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

function CopySlug({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(slug);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {

        }
    };

    return (
        <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate font-mono text-xs text-muted-foreground">{slug}</p>
            <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Slug copied" : `Copy slug ${slug}`}
                title={copied ? "Copied" : "Copy slug"}
                className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
            >
                {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
            </button>
        </div>
    );
}

function CountBadge({ n }: { n: number }) {
    return (
        <span className="rounded-md bg-muted px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground">{n}</span>
    );
}



function RowActions({ form, open }: { form: FormRow; open: (m: NonNullable<ModalState>["type"]) => void }) {
    const hasQuestions = form._count.questions > 0;

    return (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {hasQuestions ? (
                <>
                    <Button size="sm" variant="outline" onClick={() => open("questions")} className="bg-surface">
                        <ListChecks className="size-4" /> Questions <CountBadge n={form._count.questions} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => open("responses")} className="bg-surface">
                        <MessageSquareText className="size-4" /> Responses <CountBadge n={form._count.responses} />
                    </Button>
                </>
            ) : (
                <Button
                    size="sm"
                    onClick={() => open("addQuestion")}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                    <Plus className="size-4" /> Add question
                </Button>
            )}

            <Button
                size="icon"
                variant="outline"
                aria-label={`Update ${form.title}`}
                onClick={() => open("edit")}
                className="size-8 bg-surface text-muted-foreground hover:bg-primary-soft hover:text-primary"
            >
                <Pencil className="size-4" />
            </Button>
            <Button
                size="icon"
                variant="outline"
                aria-label={`Delete ${form.title}`}
                onClick={() => open("delete")}
                className="size-8 border-danger/30 bg-surface text-danger hover:bg-danger-soft hover:text-danger"
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}



export function MyFormsTable({
    data,
    query,
}: {
    data: MyFormsResponse;
    query: { search?: string; status?: string; sort?: string; limit?: number };
}) {
    const router = useRouter();
    const [modal, setModal] = useState<ModalState>(null);
    const [isPending, startTransition] = useTransition();
    const [pendingLimit, setPendingLimit] = useState<number | null>(null);
    const { items, meta, stats } = data;

    const go = (url: string) => startTransition(() => router.push(url));

    useEffect(() => {
        if (!isPending) setPendingLimit(null);
    }, [isPending]);

    const openFor = (form: FormRow) => (type: NonNullable<ModalState>["type"]) => setModal({ type, form });


    const showOwner = items.some((f) => f.owner);

    const buildParams = (extra: Record<string, string>) => {
        const p = new URLSearchParams();
        if (query.search) p.set("search", query.search);
        if (query.status) p.set("status", query.status);
        if (query.sort) p.set("sort", query.sort);
        if (query.limit) p.set("limit", String(query.limit));
        Object.entries(extra).forEach(([k, v]) => p.set(k, v));
        return `/dashboard?${p.toString()}`;
    };

    const totalPages = Math.max(meta.totalPages, 1);
    const from = items.length ? (meta.page - 1) * meta.limit + 1 : 0;
    const to = items.length ? from + items.length - 1 : 0;

    const statTiles = [
        { label: "Total forms", value: stats.totalForms, dot: null },
        { label: "Published", value: stats.publishedForms, dot: "bg-success" },
        { label: "Drafts", value: stats.draftForms, dot: "bg-warning" },
        { label: "Unpublished", value: stats.unpublishedForms, dot: "bg-muted-foreground" },
        { label: "Responses", value: stats.totalResponses, dot: "bg-primary" },
    ];

    return (
        <section className="space-y-5">
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-5">
                {statTiles.map((s, i) => {
                    const isLast = i === statTiles.length - 1;
                    return (
                        <div
                            key={s.label}
                            className={cn(
                                "border-border px-5 py-4",
                                isLast
                                    ? "col-span-2 md:col-span-1"
                                    : cn("border-b md:border-b-0", i % 2 === 0 ? "border-r" : "md:border-r")
                            )}
                        >
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                {s.dot && <span className={cn("size-2 rounded-full", s.dot)} />}
                                {s.label}
                            </p>
                            <p className="mt-1 text-2xl font-semibold tabular-nums text-card-foreground">{s.value}</p>
                        </div>
                    );
                })}
            </div>

            <FormsFilters query={query} />

            {items.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <div className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
                        <FileText className="size-6" />
                    </div>
                    <h3 className="mt-4 text-base font-medium text-card-foreground">No forms found</h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        Create your first form, or clear the filters to see everything.
                    </p>
                </div>
            ) : (
                <div
                    aria-busy={isPending}
                    className={cn(
                        "overflow-hidden rounded-xl border border-border bg-card transition-opacity",
                        isPending && "opacity-60"
                    )}
                >
                    <table className="hidden w-full text-sm md:table">
                        <thead>
                            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                                <th className="px-5 py-3.5">Form</th>
                                <th className="px-5 py-3.5">Status</th>
                                {showOwner && <th className="px-5 py-3.5">Owner</th>}
                                <th className="px-5 py-3.5">Created</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((form) => (
                                <tr key={form.id} className="transition-colors hover:bg-accent/50">
                                    <td className="max-w-[320px] px-5 py-4">
                                        <p className="truncate font-medium text-card-foreground">{form.title}</p>
                                        <CopySlug slug={form.slug} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusPill status={form.status} />
                                    </td>
                                    {showOwner && (
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-card-foreground">{form.owner?.name ?? "—"}</p>
                                            <p className="text-xs text-muted-foreground">{form.owner?.email}</p>
                                        </td>
                                    )}
                                    <td className="whitespace-nowrap px-5 py-4 text-card-foreground">
                                        {formatDate(form.createdAt)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <RowActions form={form} open={openFor(form)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ul className="divide-y divide-border md:hidden">
                        {items.map((form) => (
                            <li key={form.id} className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-card-foreground">{form.title}</p>
                                        <CopySlug slug={form.slug} />
                                    </div>
                                    <StatusPill status={form.status} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {showOwner && form.owner ? `${form.owner.name ?? form.owner.email} · ` : ""}
                                    {formatDate(form.createdAt)}
                                </p>
                                <RowActions form={form} open={openFor(form)} />
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-3 border-t border-border px-5 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span>
                                Showing{" "}
                                <span className="font-medium text-foreground">
                                    {from}–{to}
                                </span>{" "}
                                of <span className="font-medium text-foreground">{meta.total}</span>
                            </span>
                            <label className="flex items-center gap-2">
                                <span>Rows per page</span>
                                <select
                                    value={pendingLimit ?? Number(meta.limit)}
                                    onChange={(e) => {
                                        setPendingLimit(Number(e.target.value));
                                        go(buildParams({ limit: e.target.value }));
                                    }}
                                    className="h-8 rounded-md border border-input bg-surface px-2 text-sm text-foreground"
                                >
                                    {LIMIT_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="tabular-nums">
                                Page {meta.page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={meta.page <= 1 || isPending}
                                onClick={() => go(buildParams({ page: String(meta.page - 1) }))}
                            >
                                <ChevronLeft className="size-4" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={meta.page >= totalPages || isPending}
                                onClick={() => go(buildParams({ page: String(meta.page + 1) }))}
                            >
                                Next <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <FormModals modal={modal} onClose={() => setModal(null)} />
        </section>
    );
}


export function MyFormsTableSkeleton() {
    return (
        <div className="space-y-5" aria-busy="true">
            <div className="h-[82px] animate-pulse rounded-xl bg-muted" />
            <div className="h-10 animate-pulse rounded-lg bg-muted lg:max-w-sm" />
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-[72px] animate-pulse border-b border-border bg-muted/40 last:border-0" />
                ))}
            </div>
        </div>
    );
}