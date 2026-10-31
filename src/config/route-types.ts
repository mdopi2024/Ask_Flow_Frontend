import type { LucideIcon } from "lucide-react";

// ──────────────────────────────────────────────
// Shared types for dashboard routes
// ──────────────────────────────────────────────

export type UserRole = "admin" | "user";

export interface DashboardRoute {

    label: string;

    href: string;

    icon: LucideIcon;

    badge?: string;
}

export interface DashboardRouteGroup {

    groupLabel: string;

    routes: DashboardRoute[];
}
