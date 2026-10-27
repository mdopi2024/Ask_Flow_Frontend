import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MessageSquare } from "lucide-react";

// With Cache Components, new Date() can't run during prerender unless it's
// cached. The year only changes once a year, so cache it for days.
async function CurrentYear() {
    "use cache";
    cacheLife("days");
    return <>{new Date().getFullYear()}</>;
}

// lucide-react removed brand icons, so GitHub is an inline SVG.
function GithubIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

// Change these in one place.
const BRAND = "Chatform";
const CONTACT_EMAIL = "hello@example.com";
const GITHUB_URL = "https://github.com/your-username/your-repo";

const columns = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Live demo", href: "/#demo" },
        ],
    },
    {
        title: "Contact",
        links: [
            { label: "Email us", href: `mailto:${CONTACT_EMAIL}` },
            { label: "GitHub", href: GITHUB_URL },
        ],
    },
];

const linkClass =
    "text-sm text-foreground/70 transition-colors hover:text-foreground";

export function Footer() {
    return (
        <footer className="border-t border-primary/15 bg-primary-soft mt-20">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
                    {/* Brand + embed snippet */}
                    <div className="max-w-sm">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <MessageSquare className="size-4" aria-hidden />
                            </span>
                            <span className="text-lg font-semibold text-foreground">
                                {BRAND}
                            </span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                            Build a form, publish it, and add it to any website as a chat
                            widget with one line of code.
                        </p>
                        <code className="mt-5 block overflow-x-auto whitespace-nowrap rounded-lg border border-primary/15 bg-surface px-3 py-2 font-mono text-xs text-foreground">
                            {'<script src="https://your-app.com/widget.js" data-form="abc123"></script>'}
                        </code>
                    </div>

                    {/* Link columns */}
                    <nav
                        aria-label="Footer"
                        className="grid grid-cols-2 gap-8 lg:justify-self-end lg:gap-20"
                    >
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h2 className="text-sm font-semibold text-foreground">
                                    {col.title}
                                </h2>
                                <ul className="mt-4 space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className={linkClass}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary/15 pt-6 sm:flex-row sm:items-center">
                    <p className="text-sm text-foreground/70">
                        © <CurrentYear /> {BRAND}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className={linkClass}>
                            Privacy
                        </Link>
                        <Link href="/terms" className={linkClass}>
                            Terms
                        </Link>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            aria-label="Email"
                            className={linkClass}
                        >
                            <Mail className="size-4" />
                        </a>
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub repository"
                            className={linkClass}
                        >
                            <GithubIcon className="size-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}