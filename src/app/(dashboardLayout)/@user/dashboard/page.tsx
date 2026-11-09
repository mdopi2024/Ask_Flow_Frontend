export const instant = false;
import { Suspense } from "react";
import { getMyForms } from "@/actions/forms/forms.acton";
import { MyFormsResponse } from "@/types/forms.ui-types";
import { MyFormsTable, MyFormsTableSkeleton } from "@/components/onwerForm/MyFormTable";



type SearchParams = Promise<{
    page?: string;
    search?: string;
    status?: string;
    sort?: string;
    limit?: string;
}>;

async function MyFormsSection({ searchParams }: { searchParams: SearchParams }) {
    const sp = await searchParams;

    const page = Math.max(Number(sp.page) || 1, 1);
    const sort = sp.sort === "oldest" ? "oldest" : "newest";
    const limit = Math.min(Math.max(Number(sp.limit) || 10, 10), 30);

    const res: any = await getMyForms({
        page,
        limit,
        sort,
        search: sp.search || undefined,
        status: (sp.status as any) || undefined,
    });


    const payload: MyFormsResponse = res?.data ?? res;

    return <MyFormsTable data={payload} query={{ search: sp.search, status: sp.status, sort, limit }} />;
}

export default function UserDashboard({ searchParams }: { searchParams: SearchParams }) {
    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">My forms</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Search, review and manage every form and its responses.
                </p>
            </header>

            <Suspense fallback={<MyFormsTableSkeleton />}>
                <MyFormsSection searchParams={searchParams} />
            </Suspense>
        </div>
    );
}