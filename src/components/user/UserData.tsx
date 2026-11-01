import { getAllUser } from "@/actions/user/user.actions";
import UsersTable from "./UserTable";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
}>;

type Params = NonNullable<Parameters<typeof getAllUser>[0]>;
type RoleType = NonNullable<Params["role"]>;
type SortByType = NonNullable<Params["sortBy"]>;
type SortOrderType = NonNullable<Params["sortOrder"]>;

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt?: string;
};

type Meta = { page: number; limit: number; total: number; totalPages: number };

type UsersResponse = {
    success: boolean;
    message: string;
    data?: { data: User[]; meta: Meta };
};

const ROLES = ["ADMIN", "USER"];
const SORT_FIELDS = ["role", "createdAt", "name", "email"];
const LIMITS = [10, 20, 50, 100];

export default async function UsersData({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = await searchParams;

    const role = (
        sp.role && ROLES.includes(sp.role) ? sp.role : undefined
    ) as unknown as RoleType | undefined;

    const sortBy = (
        sp.sortBy && SORT_FIELDS.includes(sp.sortBy) ? sp.sortBy : "createdAt"
    ) as unknown as SortByType;

    const sortOrder = (
        sp.sortOrder === "asc" ? "asc" : "desc"
    ) as unknown as SortOrderType;

    // limit: শুধু 10/20/50/100 অনুমোদিত, নাহলে default 10
    const limitParam = Number(sp.limit);
    const limit = LIMITS.includes(limitParam) ? limitParam : 10;

    const res = (await getAllUser({
        page: Number(sp.page) || 1,
        limit,
        searchTerm: sp.searchTerm || undefined,
        role,
        sortBy,
        sortOrder,
    })) as unknown as UsersResponse;

    const users = res?.data?.data ?? [];
    const meta = res?.data?.meta ?? { page: 1, limit, total: 0, totalPages: 1 };

    return <UsersTable users={users} meta={meta} />;
}