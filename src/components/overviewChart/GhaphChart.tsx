"use client";

import { useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export type GrowthPoint = {
    label: string;
    users: number;
    forms: number;
};

type Range = "today" | "week" | "month";

const RANGES: { value: Range; label: string; subtitle: string }[] = [
    { value: "today", label: "Today", subtitle: "Hourly totals for today" },
    { value: "week", label: "Last week", subtitle: "Daily totals, last 7 days" },
    { value: "month", label: "Last month", subtitle: "Daily totals, last 30 days" },
];

const USERS_COLOR = "var(--chart-1)"; // indigo
const FORMS_COLOR = "var(--chart-2)"; // teal

// Local-time day key, so buckets match the viewer's own calendar day.
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

function buildPoints(userDates: string[], formDates: string[], range: Range): GrowthPoint[] {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (range === "today") {
        const points: GrowthPoint[] = Array.from({ length: 24 }, (_, h) => ({
            label: hourLabel(h),
            users: 0,
            forms: 0,
        }));
        const todayKey = dayKey(startOfToday);
        const add = (dates: string[], field: "users" | "forms") => {
            for (const iso of dates) {
                const d = new Date(iso);
                if (isNaN(d.getTime()) || dayKey(d) !== todayKey) continue;
                points[d.getHours()][field] += 1;
            }
        };
        add(userDates, "users");
        add(formDates, "forms");
        return points;
    }

    const days = range === "week" ? 7 : 30;
    const index = new Map<string, number>();
    const points: GrowthPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(startOfToday);
        d.setDate(d.getDate() - i);
        index.set(dayKey(d), points.length);
        points.push({
            label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            users: 0,
            forms: 0,
        });
    }

    const add = (dates: string[], field: "users" | "forms") => {
        for (const iso of dates) {
            const d = new Date(iso);
            if (isNaN(d.getTime())) continue;
            const i = index.get(dayKey(d));
            if (i !== undefined) points[i][field] += 1;
        }
    };
    add(userDates, "users");
    add(formDates, "forms");
    return points;
}

export function GrowthChart({
    userDates,
    formDates,
}: {
    userDates: string[];
    formDates: string[];
}) {
    const [range, setRange] = useState<Range>("week");

    const data = useMemo(
        () => buildPoints(userDates, formDates, range),
        [userDates, formDates, range]
    );
    const active = RANGES.find((r) => r.value === range)!;
    const xInterval = range === "week" ? 0 : range === "today" ? 2 : 3;

    return (
        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold">Users and forms created</h2>
                    <p className="text-sm text-muted-foreground">{active.subtitle}</p>
                </div>

                <div role="group" aria-label="Time range" className="inline-flex rounded-lg bg-muted p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            onClick={() => setRange(r.value)}
                            aria-pressed={range === r.value}
                            className={
                                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                                (range === r.value
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground")
                            }
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={USERS_COLOR} stopOpacity={0.35} />
                                <stop offset="100%" stopColor={USERS_COLOR} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="formsFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={FORMS_COLOR} stopOpacity={0.35} />
                                <stop offset="100%" stopColor={FORMS_COLOR} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            interval={xInterval}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            fontSize={12}
                        />
                        <Tooltip
                            cursor={{ stroke: "var(--border)" }}
                            contentStyle={{
                                background: "var(--popover)",
                                color: "var(--popover-foreground)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius)",
                                fontSize: 13,
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />

                        <Area
                            type="monotone"
                            dataKey="users"
                            name="Users"
                            stroke={USERS_COLOR}
                            strokeWidth={2}
                            fill="url(#usersFill)"
                        />
                        <Area
                            type="monotone"
                            dataKey="forms"
                            name="Forms"
                            stroke={FORMS_COLOR}
                            strokeWidth={2}
                            fill="url(#formsFill)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}