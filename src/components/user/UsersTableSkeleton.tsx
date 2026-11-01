export default function UsersTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-[72px] border-b border-border" />
            <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                        <div className="size-9 animate-pulse rounded-full bg-muted" />
                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}