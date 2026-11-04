import { Suspense } from "react";
import { connection } from "next/server";
import { getAllForms } from "@/actions/forms/forms.acton";
import { getAllUser } from "@/actions/user/user.actions";
import { GrowthChart } from "@/components/overviewChart/GhaphChart";

type Dated = { createdAt?: string | Date };

function extractList(result: unknown, key: string): Dated[] {
  const data = (result as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) return data as Dated[];
  const nested = (data as Record<string, unknown> | null | undefined)?.[key];
  return Array.isArray(nested) ? (nested as Dated[]) : [];
}

// Send plain ISO strings to the client; it buckets them in the viewer's local time.
function toIsoList(items: Dated[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (!item.createdAt) continue;
    const d = new Date(item.createdAt);
    if (!isNaN(d.getTime())) out.push(d.toISOString());
  }
  return out;
}

async function DashboardCharts() {
  await connection(); // render at request time

  const [userData, formsData] = await Promise.all([getAllUser(), getAllForms()]);

  return (
    <GrowthChart
      userDates={toIsoList(extractList(userData, "users"))}
      formDates={toIsoList(extractList(formsData, "forms"))}
    />
  );
}

function ChartSkeleton() {
  return <div className="h-96 animate-pulse rounded-xl border border-border bg-muted" />;
}

export default function AdminPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <DashboardCharts />
      </Suspense>
    </div>
  );
}