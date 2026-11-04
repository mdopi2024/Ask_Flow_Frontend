import { Suspense } from "react";
import { getAllForms } from "@/actions/forms/forms.acton";
import { FormsStatsSkeleton, FormsTableSkeleton } from "@/components/forms/Forms-skeleton";
import { FormsStats } from "@/components/forms/Forms-stats";
import { FormsTable } from "@/components/forms/Forms-table";
import { parseFormsQuery, RawSearchParams } from "@/components/forms/Form.queary";
import { FormsToolbar } from "@/components/forms/FormToolbar";


type SearchParams = Promise<RawSearchParams>;

export default function FormsPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <div className="mx-auto w-full space-y-6 p-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Search, review and manage every form and its responses.
                </p>
            </header>

            <Suspense fallback={<FormsPageSkeleton />}>
                <FormsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

async function FormsContent({ searchParams }: { searchParams: SearchParams }) {
    const query = parseFormsQuery(await searchParams);
    const res = await getAllForms(query);

    if (!res.success) {
        return (
            <div role="alert" className="rounded-xl border border-border bg-card p-6 text-sm text-danger">
                {res.message}
            </div>
        );
    }

    const { items, meta, stats } = res.data;

    return (
        <div className="space-y-6">
            <FormsStats stats={stats} />
            <FormsToolbar />
            <FormsTable items={items} meta={meta} query={query} />
        </div>
    );
}

function FormsPageSkeleton() {
    return (
        <div className="space-y-6">
            <FormsStatsSkeleton />
            <div className="h-9" />
            <FormsTableSkeleton />
        </div>
    );
}