import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How it works",
    description:
        "Create a form, publish it, embed the chatbot widget on your website and review every response from your dashboard.",
};

const EMBED_SNIPPET = `<script
  src="https://your-app.com/widget.js"
  data-form="your-form-id"
  async
></script>`;

/* ---------- Small window frame shared by the mock-ups ---------- */
function Frame({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-danger/70" />
                <span className="size-2.5 rounded-full bg-warning/70" />
                <span className="size-2.5 rounded-full bg-success/70" />
                <span className="ml-3 truncate text-xs text-muted-foreground">
                    {title}
                </span>
            </div>
            <div className="p-4 sm:p-5">{children}</div>
        </div>
    );
}

/* ---------- Mock-ups ---------- */
function BuilderMock() {
    const rows = [
        { label: "Your name", type: "Text", required: true },
        { label: "Work email", type: "Email", required: true },
        { label: "Do you have a website?", type: "Yes / No", required: false },
        { label: "What are you looking for?", type: "Choice", required: false },
    ];
    return (
        <Frame title="Form builder">
            <ul className="space-y-2">
                {rows.map((r) => (
                    <li
                        key={r.label}
                        className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm"
                    >
                        <span aria-hidden="true" className="text-muted-foreground">
                            ⋮⋮
                        </span>
                        <span className="min-w-0 flex-1 truncate text-card-foreground">
                            {r.label}
                        </span>
                        <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                            {r.type}
                        </span>
                        {r.required && (
                            <span className="rounded-md bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning-foreground">
                                Required
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            <p className="mt-3 rounded-xl border border-dashed border-input px-3 py-2.5 text-center text-sm text-muted-foreground">
                Add a question
            </p>
        </Frame>
    );
}

function PublishMock() {
    return (
        <Frame title="Contact form">
            <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success-foreground">
                    <span className="size-1.5 rounded-full bg-success" />
                    Published
                </span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Public link</p>
            <p className="mt-1 break-all rounded-lg border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground">
                your-app.com/f/k3x9a2
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Unpublish at any time. The link then stops accepting responses.
            </p>
        </Frame>
    );
}

function CodeMock() {
    return (
        <Frame title="index.html">
            <pre
                className="overflow-x-auto rounded-xl bg-foreground p-4 font-mono text-xs leading-relaxed text-background"
                tabIndex={0}
                aria-label="Embed code snippet"
            >
                <code>{EMBED_SNIPPET}</code>
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">
                Paste it before the closing body tag of any page.
            </p>
        </Frame>
    );
}

function ChatMock() {
    const bot =
        "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-card-foreground";
    return (
        <div
            className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/10"
            role="img"
            aria-label="Example chatbot conversation with an email validation message"
        >
            <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                    C
                </span>
                <div className="leading-tight">
                    <p className="text-sm font-semibold">Contact form</p>
                    <p className="text-xs opacity-80">Takes about a minute</p>
                </div>
            </div>
            <div className="space-y-3 p-4 text-sm">
                <p className={bot}>Hi! Mind answering a few quick questions?</p>
                <p className={bot}>Do you already have a website?</p>
                <div className="flex justify-end gap-2">
                    <span className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground">
                        Yes
                    </span>
                    <span className="rounded-full border border-border px-4 py-1.5 text-muted-foreground">
                        No
                    </span>
                </div>
                <p className={bot}>Great. What&rsquo;s your email address?</p>
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                    jordan@example
                </p>
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-danger-soft px-3 py-2 text-danger-foreground">
                    Enter a valid email, like name@example.com.
                </p>
            </div>
            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <span className="flex-1 text-sm text-muted-foreground">
                    Type your answer
                </span>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Send
                </span>
            </div>
        </div>
    );
}

function ResponsesMock() {
    const rows = [
        { name: "Jordan Lee", email: "jordan@acme.co", time: "Today, 10:42" },
        { name: "Amina Rahman", email: "amina@studio.io", time: "Today, 09:15" },
        { name: "Sam Ortiz", email: "sam@northwind.com", time: "Yesterday, 17:03" },
    ];
    return (
        <Frame title="Responses">
            <div className="mb-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-primary-soft p-3">
                    <p className="text-xs text-muted-foreground">Total forms</p>
                    <p className="text-2xl font-semibold text-primary">4</p>
                </div>
                <div className="rounded-xl bg-accent p-3">
                    <p className="text-xs text-muted-foreground">Total responses</p>
                    <p className="text-2xl font-semibold text-accent-foreground">128</p>
                </div>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border text-sm">
                {rows.map((r) => (
                    <li
                        key={r.name}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                    >
                        <span className="min-w-0">
                            <span className="block truncate text-card-foreground">
                                {r.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                                {r.email}
                            </span>
                        </span>
                        <time className="shrink-0 text-xs text-muted-foreground">
                            {r.time}
                        </time>
                    </li>
                ))}
            </ul>
        </Frame>
    );
}

/* ---------- Content ---------- */
const steps = [
    {
        short: "Build",
        title: "Build your form",
        body: "Add questions one by one: short text, email, multiple choice or yes/no. Drag to reorder, edit or delete any question, and mark the ones people must answer. Preview the form before you publish.",
        visual: <BuilderMock />,
    },
    {
        short: "Publish",
        title: "Publish it",
        body: "Publishing gives your form a unique public link you can share right away. Unpublish whenever you like and the form stops collecting responses straight away.",
        visual: <PublishMock />,
    },
    {
        short: "Embed",
        title: "Add the chatbot to your website",
        body: "Choose a color, write a welcome message and copy one line of JavaScript into your site. A floating chat button appears in the corner and works on desktop and mobile.",
        visual: <CodeMock />,
    },
    {
        short: "Collect",
        title: "Visitors answer in a chat",
        body: "The widget asks one question at a time. People type an answer or tap a button, and invalid input, such as a malformed email, is caught before they move on. A completion message confirms their answers were sent.",
        visual: <ChatMock />,
    },
    {
        short: "Review",
        title: "Review responses in your dashboard",
        body: "Every submission is saved to the database with its timestamp. See your total forms and responses, check each form's status, and open individual submissions.",
        visual: <ResponsesMock />,
    },
];

/* ---------- Page ---------- */
export default function HowItWorksPage() {
    return (
        <main className="bg-background text-foreground">
            {/* Intro (no buttons: the landing hero already has the CTAs) */}
            <section className="relative overflow-hidden border-b border-border">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
                />
                <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
                    <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
                        From a blank form to saved responses in five steps
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                        Build a form, publish it, put the chatbot on your site and read what
                        people send, all from one place.
                    </p>
                    <nav
                        aria-label="Jump to a step"
                        className="mt-10 flex flex-wrap justify-center gap-2"
                    >
                        {steps.map((s, i) => (
                            <a
                                key={s.short}
                                href={`#step-${i + 1}`}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 py-1.5 pl-1.5 pr-4 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                                    {i + 1}
                                </span>
                                {s.short}
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Steps */}
            <section
                aria-labelledby="steps-heading"
                className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24"
            >
                <h2 id="steps-heading" className="sr-only">
                    The five steps
                </h2>
                <ol className="relative space-y-16 sm:space-y-24">
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-primary/60 via-border to-teal/60"
                    />
                    {steps.map((step, i) => (
                        <li
                            key={step.title}
                            id={`step-${i + 1}`}
                            className="relative scroll-mt-24 pl-14 sm:pl-20"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground ring-8 ring-background"
                            >
                                {i + 1}
                            </span>
                            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                                    <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                                        <span className="sr-only">Step {i + 1}: </span>
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 max-w-prose text-pretty leading-relaxed text-muted-foreground">
                                        {step.body}
                                    </p>
                                </div>
                                <div
                                    className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}
                                >
                                    <div
                                        aria-hidden="true"
                                        className="absolute -inset-3 -z-0 rounded-3xl bg-gradient-to-br from-primary-soft via-accent to-transparent"
                                    />
                                    <div className="relative">{step.visual}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {/* One closing call to action */}
            <section className="px-5 sm:px-8 ">
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal/30 blur-3xl"
                    />
                    <h2 className="relative mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                        Ready to collect your first response?
                    </h2>
                    <p className="relative mx-auto mt-3 max-w-md text-primary-foreground/80">
                        Most forms take a few minutes to build and publish.
                    </p>
                    <Link
                        href="/dashboard"
                        className="relative mt-8 inline-flex rounded-lg bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-offset-4"
                    >
                        Start building
                    </Link>
                </div>
            </section>
        </main>
    );
}