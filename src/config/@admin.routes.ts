import {
    LayoutDashboard,
    MessageSquareText,
    FileText,
    Settings,
    Users,
    BarChart3,
    Shield,
    Bell,
} from "lucide-react";
import type { DashboardRouteGroup } from "./route-types";



export const adminRoutes: DashboardRouteGroup[] = [
    {
        groupLabel: "Overview",
        routes: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        groupLabel: "Management",
        routes: [
            {
                label: "All Forms",
                href: "/dashboard/forms",
                icon: FileText,
            },
            {
                label: "Users",
                href: "/dashboard/users",
                icon: Users,
            },
        ],
    },

];
