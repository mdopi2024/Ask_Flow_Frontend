import UsersData from "@/components/user/UserData";
import UsersTableSkeleton from "@/components/user/UsersTableSkeleton";
import { Suspense } from "react";


export type UsersSearchParams = Promise<{
    page?: string;
    searchTerm?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
}>;

export default function UsersPage({
    searchParams,
}: {
    searchParams: UsersSearchParams;
}) {
    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Users
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage all registered users and their roles.
                </p>
            </div>

            <Suspense fallback={<UsersTableSkeleton />}>
                <UsersData searchParams={searchParams} />
            </Suspense>
        </div>
    );
}