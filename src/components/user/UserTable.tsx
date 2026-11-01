"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    BadgeCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Search,
    UsersRound,
} from "lucide-react";
import ChangeRoleModal from "./UserRoleModel";


type User = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | string;
    emailVerified: boolean;
    createdAt?: string;
};

type Meta = { page: number; limit: number; total: number; totalPages: number };

const ROLES = [
    { label: "All roles", value: "" },
    { label: "Admin", value: "ADMIN" },
    { label: "User", value: "USER" },
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "createdAt:desc" },
    { label: "Oldest first", value: "createdAt:asc" },
    { label: "Name A → Z", value: "name:asc" },
    { label: "Name Z → A", value: "name:desc" },
];

const LIMIT_OPTIONS = [10, 20, 50, 100];

export default function UsersTable({ users, meta }: { users: User[]; meta: Meta }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [roleUser, setRoleUser] = useState<User | null>(null);

    const currentSearch = searchParams.get("searchTerm") ?? "";
    const currentRole = searchParams.get("role") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";

    const [search, setSearch] = useState(currentSearch);
    const firstRender = useRef(true);

    const updateUrl = (changes: Record<string, string>, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(changes).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        if (resetPage) params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    // Search debounce
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (search === currentSearch) return;
        const timer = setTimeout(() => updateUrl({ searchTerm: search }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleSort = (field: string) => {
        const nextOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
        updateUrl({ sortBy: field, sortOrder: nextOrder }, false);
    };

    const handleSortSelect = (value: string) => {
        const [field, order] = value.split(":");
        updateUrl({ sortBy: field, sortOrder: order }, false);
    };

    const goToPage = (page: number) => updateUrl({ page: String(page) }, false);

    const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const to = Math.min(meta.page * meta.limit, meta.total);

    const sortValue = `${sortBy}:${sortOrder}`;
    const isKnownSort = SORT_OPTIONS.some((o) => o.value === sortValue);

    const selectClass =
        "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isPending && (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        )}

                        <select
                            value={isKnownSort ? sortValue : ""}
                            onChange={(e) => handleSortSelect(e.target.value)}
                            className={selectClass}
                            aria-label="Sort users"
                        >
                            {!isKnownSort && (
                                <option value="" disabled>
                                    Sort by...
                                </option>
                            )}
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={currentRole}
                            onChange={(e) => updateUrl({ role: e.target.value })}
                            className={selectClass}
                            aria-label="Filter by role"
                        >
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div
                    className={`overflow-x-auto transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}
                >
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <SortableTh label="User" field="name" {...{ sortBy, sortOrder, handleSort }} />
                                <SortableTh label="Email" field="email" {...{ sortBy, sortOrder, handleSort }} />
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <SortableTh label="Joined" field="createdAt" {...{ sortBy, sortOrder, handleSort }} />
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16">
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                <UsersRound className="size-6 text-muted-foreground" />
                                            </div>
                                            <p className="font-medium text-foreground">No users found</p>
                                            <p className="text-sm text-muted-foreground">
                                                Try changing your search or filter.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                                                    {user.name?.charAt(0).toUpperCase() ?? "?"}
                                                </div>
                                                <span className="font-medium text-foreground">{user.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>

                                        <td className="px-4 py-3">
                                            <RoleBadge role={user.role} />
                                        </td>

                                        <td className="px-4 py-3">
                                            {user.emailVerified ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success-foreground">
                                                    <BadgeCheck className="size-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning-foreground">
                                                    Unverified
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-muted-foreground">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setRoleUser(user)}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground transition hover:bg-muted"
                                            >
                                                Change role
                                                <ChevronDown className="size-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 lg:flex-row">
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{from}</span> to{" "}
                            <span className="font-medium text-foreground">{to}</span> of{" "}
                            <span className="font-medium text-foreground">{meta.total}</span> users
                        </p>

                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            Rows per page
                            <select
                                value={meta.limit}
                                onChange={(e) => updateUrl({ limit: e.target.value })}
                                className="h-9 rounded-lg border border-input bg-background px-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                            >
                                {LIMIT_OPTIONS.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={meta.page <= 1 || isPending}
                            onClick={() => goToPage(meta.page - 1)}
                            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </button>

                        <span className="px-2 text-sm text-muted-foreground">
                            Page {meta.page} of {Math.max(meta.totalPages, 1)}
                        </span>

                        <button
                            disabled={meta.page >= meta.totalPages || isPending}
                            onClick={() => goToPage(meta.page + 1)}
                            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            {roleUser && (
                <ChangeRoleModal
                    userId={roleUser.id}
                    name={roleUser.name}
                    email={roleUser.email}
                    currentRole={roleUser.role}
                    onClose={() => setRoleUser(null)}
                />
            )}
        </>
    );
}

function RoleBadge({ role }: { role: string }) {
    const isAdmin = role === "ADMIN";
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${isAdmin
                ? "bg-primary-soft text-primary"
                : "bg-secondary text-secondary-foreground"
                }`}
        >
            {role}
        </span>
    );
}

function SortableTh({
    label,
    field,
    sortBy,
    sortOrder,
    handleSort,
}: {
    label: string;
    field: string;
    sortBy: string;
    sortOrder: string;
    handleSort: (field: string) => void;
}) {
    const active = sortBy === field;
    const Icon = !active ? ArrowUpDown : sortOrder === "asc" ? ArrowUp : ArrowDown;

    return (
        <th className="px-4 py-3 font-medium">
            <button
                onClick={() => handleSort(field)}
                className={`inline-flex items-center gap-1 uppercase tracking-wide transition hover:text-foreground ${active ? "text-foreground" : ""
                    }`}
            >
                {label}
                <Icon className="size-3.5" />
            </button>
        </th>
    );
}