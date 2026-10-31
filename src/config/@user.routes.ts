import {
    LayoutDashboard,
    MessageSquareText,
    FileText,
    Settings,
    Bell,
    HelpCircle,
    Palette,
} from "lucide-react";
import type { DashboardRouteGroup } from "./route-types";



export const userRoutes: DashboardRouteGroup[] = [
    {
        groupLabel: "Overview",
        routes: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                label: "My Forms",
                href: "/dashboard/forms",
                icon: FileText,
            },
            {
                label: "Conversations",
                href: "/dashboard/conversations",
                icon: MessageSquareText,
            },
        ],
    },
    {
        groupLabel: "Customization",
        routes: [
            {
                label: "Appearance",
                href: "/dashboard/appearance",
                icon: Palette,
            },
            {
                label: "Notifications",
                href: "/dashboard/notifications",
                icon: Bell,
            },
        ],
    },
    {
        groupLabel: "Support",
        routes: [
            {
                label: "Help Center",
                href: "/dashboard/help",
                icon: HelpCircle,
            },

        ],
    },
];
