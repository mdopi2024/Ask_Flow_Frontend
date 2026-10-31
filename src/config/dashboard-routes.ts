

export type { UserRole, DashboardRoute, DashboardRouteGroup } from "./route-types";

import { userRoutes } from "./@user.routes";
import { adminRoutes } from "./@admin.routes";
import type { UserRole, DashboardRouteGroup } from "./route-types";

export { userRoutes } from "./@user.routes";
export { adminRoutes } from "./@admin.routes";

export function getRoutesByRole(role: UserRole): DashboardRouteGroup[] {
    return role === "admin" ? adminRoutes : userRoutes;
}
