import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Features",
    description:
        "Build forms, turn them into a chatbot widget, embed it on any website and manage every response from one dashboard.",
};

/* ---------- Shared card shell ---------- */
function Card({
    title,
    body,
    className = "",
    children,
}: {
    title: string;
    body: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <article
            className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 ${className}`}
        >
            <h3 className="text-xl font-semibold tracking-tight text-card-foreground">
                {title}
            </h3>
            <p className="mt-2 max-w-prose text-pretty leading-relaxed text-muted-foreground">
                {body}
            </p>
            {children && <div className="mt-6 flex-1">{children}</div>}
        </article>
    );
}

/* ---------- Mini visuals ---------- */
function QuestionList() {
    const rows = [
        ["Your name", "Text"],
        ["Work email", "Email"],
        ["Which plan are you on?", "Choice"],
        ["Can we contact you?", "Yes / No"],
    ];
    return (
        <ul className="space-y-2">
            {rows.map(([label, type], i) => (
                <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
                >
                    <span aria-hidden="true" className="text-muted-foreground">
                        ⋮⋮
                    </span>
                    <span className="min-w-0 flex-1 truncate text-card-foreground">
                        {label}
                    </span>
                    <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                        {type}
                    </span>
                    {i < 2 && (
                        <span className="rounded-md bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning-foreground">
                            Required
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}

function MiniChat() {
    return (
        <div
            className="space-y-2 text-sm"
            role="img"
            aria-label="Chatbot asking a question with answer buttons"
        >
            <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-card-foreground">
                Do you have a website?
            </p>
            <div className="flex gap-2">
                <span className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground">
                    Yes
                </span>
                <span className="rounded-full border border-border px-4 py-1.5 text-muted-foreground">
                    No
                </span>
            </div>
        </div>
    );
}

function Snippet() {
    return (
        <pre
            className="overflow-x-auto rounded-xl bg-foreground p-4 font-mono text-xs leading-relaxed text-background"
            tabIndex={0}
            aria-label="Embed code snippet"
        >
            <code>{`<script
  src="https://your-app.com/widget.js"
  data-form="your-form-id"
  async
></script>`}</code>
        </pre>
    );
}

function PublishToggle() {
    return (
        <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
                <span className="text-card-foreground">Published</span>
                <span
                    aria-hidden="true"
                    className="flex h-5 w-9 items-center justify-end rounded-full bg-success px-0.5"
                >
                    <span className="size-4 rounded-full bg-white" />
                </span>
            </div>
            <p className="break-all rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                your-app.com/f/k3x9a2
            </p>
        </div>
    );
}

function Stats() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary-soft p-4">
                <p className="text-xs text-muted-foreground">Total forms</p>
                <p className="text-3xl font-semibold text-primary">4</p>
            </div>
            <div className="rounded-xl bg-accent p-4">
                <p className="text-xs text-muted-foreground">Total responses</p>
                <p className="text-3xl font-semibold text-accent-foreground">128</p>
            </div>
        </div>
    );
}

function Submissions() {
    const rows = [
        ["Jordan Lee", "Today, 10:42"],
        ["Amina Rahman", "Today, 09:15"],
        ["Sam Ortiz", "Yesterday, 17:03"],
    ];
    return (
        <ul className="divide-y divide-border rounded-xl border border-border text-sm">
            {rows.map(([name, time]) => (
                <li key={name} className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-card-foreground">{name}</span>
                    <time className="text-xs text-muted-foreground">{time}</time>
                </li>
            ))}
        </ul>
    );
}

function Customize() {
    const colors = ["bg-primary", "bg-teal", "bg-warning", "bg-chart-4", "bg-chart-5"];
    return (
        <div className="space-y-3 text-sm">
            <div className="flex gap-2" aria-hidden="true">
                {colors.map((c, i) => (
                    <span
                        key={c}
                        className={`size-8 rounded-full ${c} ${i === 0 ? "ring-2 ring-ring ring-offset-2 ring-offset-card" : ""
                            }`}
                    />
                ))}
            </div>
            <p className="rounded-xl border border-border bg-surface px-3 py-2.5 text-card-foreground">
                Hi there! Got a minute to tell us about your project?
            </p>
        </div>
    );
}

function Validation() {
    return (
        <div className="space-y-2 text-sm">
            <p className="rounded-xl bg-danger-soft px-3 py-2.5 text-danger-foreground">
                Enter a valid email, like name@example.com.
            </p>
            <p className="rounded-xl bg-success-soft px-3 py-2.5 text-success-foreground">
                Thanks! Your answers were sent.
            </p>
        </div>
    );
}

function Devices() {
    return (
        <div
            aria-hidden="true"
            className="flex items-end justify-center gap-4 rounded-xl bg-muted p-5"
        >
            <div className="relative h-24 w-40 rounded-lg border-2 border-border bg-card">
                <span className="absolute bottom-2 right-2 size-6 rounded-full bg-primary" />
            </div>
            <div className="relative h-24 w-14 rounded-xl border-2 border-border bg-card">
                <span className="absolute bottom-2 right-2 size-5 rounded-full bg-primary" />
            </div>
        </div>
    );
}

/* ---------- Question types ---------- */
const questionTypes = [
    { name: "Text", note: "Short, free-form answers such as a name or a message." },
    { name: "Email", note: "Checked for a valid address before the visitor continues." },
    { name: "Multiple choice", note: "Visitors tap one answer button from your list." },
    { name: "Yes / No", note: "Two buttons for quick, clear decisions." },
];

/* ---------- Page ---------- */
export default function FeaturesPage() {
    return (
        <main className="bg-background text-foreground">
            {/* Intro (no buttons: the landing hero already has them) */}
            <section className="relative overflow-hidden border-b border-border">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
                />
                <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
                    <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                        Everything you need to collect answers in a chat
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                        A form builder, a chatbot widget you can embed anywhere, and a
                        dashboard that keeps every response in one place.
                    </p>
                </div>
            </section>

            {/* Feature grid */}
            <section
                aria-labelledby="features-heading"
                className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
            >
                <h2 id="features-heading" className="sr-only">
                    Features
                </h2>
                <div className="grid gap-5 lg:grid-cols-6">
                    <Card
                        className="lg:col-span-4"
                        title="A form builder that stays simple"
                        body="Add questions, drag them into order, edit or delete them, and mark the ones people must answer. Preview the whole form before you publish."
                    >
                        <QuestionList />
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Chat-style questions"
                        body="The widget asks one question at a time and offers answer buttons where they fit."
                    >
                        <MiniChat />
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Built-in validation"
                        body="Required questions and email formats are checked as people answer, and a completion message closes the chat."
                    >
                        <Validation />
                    </Card>

                    <Card
                        className="lg:col-span-4"
                        title="Embed on any website"
                        body="Copy one line of JavaScript into your site and a floating chat button appears. No framework or build step needed on the host page."
                    >
                        <Snippet />
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Match your brand"
                        body="Pick the widget color and write your own welcome message."
                    >
                        <Customize />
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Public links and publishing"
                        body="Every form gets a unique public URL. Publish or unpublish whenever you like."
                    >
                        <PublishToggle />
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Works on every screen"
                        body="The widget and the dashboard adapt to desktop and mobile."
                    >
                        <Devices />
                    </Card>

                    <Card
                        className="lg:col-span-3"
                        title="A dashboard at a glance"
                        body="See your total forms and responses, and check which forms are drafts or published."
                    >
                        <Stats />
                    </Card>

                    <Card
                        className="lg:col-span-3"
                        title="Every submission, saved"
                        body="Responses are stored in your database with a timestamp, so you can open each one and see exactly what was sent and when."
                    >
                        <Submissions />
                    </Card>
                </div>
            </section>

            {/* Question types */}
            <section
                aria-labelledby="types-heading"
                className="border-y border-border bg-muted/50"
            >
                <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                    <h2
                        id="types-heading"
                        className="max-w-xl text-balance text-3xl font-semibold tracking-tight"
                    >
                        Four question types cover most forms
                    </h2>
                    <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {questionTypes.map((q) => (
                            <div
                                key={q.name}
                                className="rounded-2xl border border-border bg-card p-5"
                            >
                                <dt className="font-semibold text-card-foreground">{q.name}</dt>
                                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {q.note}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* One closing call to action */}
            <section className="px-5  sm:px-8 ">
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal/30 blur-3xl"
                    />
                    <h2 className="relative mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Build your first chatbot form today
                    </h2>
                    <p className="relative mx-auto mt-3 max-w-md text-primary-foreground/80">
                        Not sure where to begin? See{" "}
                        <Link
                            href="/how-it-works"
                            className="font-medium underline underline-offset-4"
                        >
                            how it works
                        </Link>
                        .
                    </p>
                    <Link
                        href="/signup"
                        className="relative mt-8 inline-flex rounded-lg bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-offset-4"
                    >
                        Start building
                    </Link>
                </div>
            </section>
        </main>
    );
}