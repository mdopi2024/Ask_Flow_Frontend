import type { FormStats } from "@/types/forms.types";

const cards: { key: keyof FormStats; label: string; dot?: string }[] = [
    { key: "totalForms", label: "Total forms" },
    { key: "publishedForms", label: "Published", dot: "bg-success" },
    { key: "draftForms", label: "Drafts", dot: "bg-warning" },
    { key: "unpublishedForms", label: "Unpublished", dot: "bg-muted-foreground" },
    { key: "totalResponses", label: "Responses", dot: "bg-primary" },
];

export function FormsStats({ stats }: { stats: FormStats }) {
    return (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-5">
            {cards.map(({ key, label, dot }) => (
                <div key={key} className="bg-card p-4 last:col-span-2 sm:last:col-span-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        {dot && <span className={`size-2 rounded-full ${dot}`} aria-hidden />}
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">{stats[key] ?? 0}</p>
                </div>
            ))}
        </div>
    );
}