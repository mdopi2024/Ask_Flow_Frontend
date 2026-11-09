import {
    LayoutDashboard,
    MessageSquareText,
    FileText,
    Settings,
    Bell,
    HelpCircle,
    Palette,
    FilePlus,
} from "lucide-react";
import type { DashboardRouteGroup } from "./route-types";



export const userRoutes: DashboardRouteGroup[] = [
    {
        groupLabel: "Overview",
        routes: [
            {
                label: "My Forms",
                href: "/dashboard",
                icon: FileText,
            },
            {
                label: "Create New Form",
                href: "/dashboard/create-form",
                icon: FilePlus,
            }
        ],
    },

];
