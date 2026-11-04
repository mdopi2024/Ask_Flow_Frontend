const bar = "animate-pulse rounded-md bg-muted";

export function FormsStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card p-4 last:col-span-2 sm:last:col-span-1">
                    <div className={`${bar} h-4 w-20`} />
                    <div className={`${bar} mt-3 h-7 w-12`} />
                </div>
            ))}
        </div>
    );
}

export function FormsTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-11 border-b border-border bg-muted/50" />
            <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6 px-4 py-4">
                        <div className="flex-1 space-y-2">
                            <div className={`${bar} h-4 w-44`} />
                            <div className={`${bar} h-3 w-32`} />
                        </div>
                        <div className={`${bar} hidden h-6 w-20 rounded-full sm:block`} />
                        <div className={`${bar} hidden h-8 w-28 md:block`} />
                        <div className={`${bar} h-8 w-44`} />
                    </div>
                ))}
            </div>
            <div className="h-14 border-t border-border" />
        </div>
    );
}