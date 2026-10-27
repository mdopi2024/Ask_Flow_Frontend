import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, MessageSquareText, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* 1. CONTENT (edit text here)                                         */
/* ------------------------------------------------------------------ */

const content = {
    badge: "Forms that feel like a conversation",
    title: "Turn your forms into",
    titleHighlight: "friendly chats",
    description:
        "Build a form in minutes, embed a chatbot widget on any website with one script, and collect every response in a simple dashboard.",
    primaryCta: { label: "Create your first form", href: "/dashboard/forms/new" },
    secondaryCta: { label: "See live demo", href: "/#demo" },
    points: ["No code needed", "One-line embed", "Works on mobile"],
};

// Reusable class names (same as the navbar)
const primaryButton = "bg-primary text-primary-foreground hover:bg-primary-hover";

/* ------------------------------------------------------------------ */
/* 2. LEFT SIDE: text and buttons                                      */
/* ------------------------------------------------------------------ */

function HeroText() {
    return (
        <div className="text-center lg:text-left">
            {/* Small badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-teal" />
                {content.badge}
            </span>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {content.title} <span className="text-primary">{content.titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
                {content.description}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                    href={content.primaryCta.href}
                    className={cn(buttonVariants({ size: "lg" }), primaryButton)}
                >
                    {content.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                    href={content.secondaryCta.href}
                    className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "border-border hover:bg-primary-soft hover:text-primary"
                    )}
                >
                    {content.secondaryCta.label}
                </Link>
            </div>

            {/* Small checklist */}
            <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                {content.points.map((point) => (
                    <li key={point} className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-success" />
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 3. RIGHT SIDE: fake chat widget (just a picture, no real logic)     */
/* ------------------------------------------------------------------ */

function BotMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground">
            {children}
        </div>
    );
}

function UserMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
            {children}
        </div>
    );
}

function ChatPreview() {
    return (
        <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
            {/* Chat window */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                        <MessageSquareText className="h-4 w-4" />
                    </span>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold">FormChat Assistant</p>
                        <p className="flex items-center gap-1 text-xs opacity-90">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                            Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-3 p-4">
                    <BotMessage>Hi there! Do you want to join our newsletter?</BotMessage>

                    <div className="flex gap-2">
                        <span className="rounded-full border border-primary bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                            Yes
                        </span>
                        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                            No
                        </span>
                    </div>

                    <UserMessage>Yes</UserMessage>

                    <BotMessage>Great! What is your email address?</BotMessage>
                </div>

                {/* Input row */}
                <div className="flex items-center gap-2 border-t border-border p-3">
                    <div className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                        name@company.com
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Send className="h-4 w-4" />
                    </span>
                </div>
            </div>

            {/* Floating "new response" card */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-lg sm:-left-8">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div className="leading-tight">
                    <p className="text-xs font-semibold text-foreground">New response</p>
                    <p className="text-[11px] text-muted-foreground">Just now</p>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 4. MAIN HERO                                                        */
/* ------------------------------------------------------------------ */

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Soft background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:py-28">
                <HeroText />
                <ChatPreview />
            </div>
        </section>
    );
}