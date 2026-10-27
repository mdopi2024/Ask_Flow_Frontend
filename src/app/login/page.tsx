"use client";

import { useRef, useState, type FormEvent, type SVGProps } from "react";
import { isAxiosError } from "axios";
import authService from "@/services/auth.sevices";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Admin quick-fill credentials (shown in all environments, including production).
const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "Admin@123",
};

/* ---------- Inline icons (no extra dependency) ---------- */

const iconProps: SVGProps<SVGSVGElement> = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

const MailIcon = () => (
    <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
    </svg>
);

const LockIcon = () => (
    <svg {...iconProps}>
        <rect x="4" y="11" width="16" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
);

const EyeIcon = () => (
    <svg {...iconProps}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg {...iconProps}>
        <path d="M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.7 16.7 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        <path d="m3 3 18 18" />
    </svg>
);

const ShieldIcon = () => (
    <svg {...iconProps}>
        <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const FormIcon = () => (
    <svg {...iconProps} width={20} height={20}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
);

const ChatIcon = () => (
    <svg {...iconProps} width={20} height={20}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12Z" />
        <path d="M9 11h6M9 14h3" />
    </svg>
);

const ChartIcon = () => (
    <svg {...iconProps} width={20} height={20}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
    <svg {...iconProps} width={size} height={size} strokeWidth={2.2}>
        <path d="m5 12 5 5 9-10" />
    </svg>
);

const AlertIcon = () => (
    <svg {...iconProps} width={16} height={16}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
    </svg>
);

const ArrowIcon = () => (
    <svg {...iconProps} width={16} height={16} strokeWidth={2}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

/* ---------- Styles ---------- */

const inputBase =
    "h-11 w-full rounded-xl border border-input bg-surface text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15";

// Soft dotted background for the form side (adapts to light/dark via currentColor).
const dotBackground = {
    backgroundImage:
        "radial-gradient(circle, color-mix(in srgb, currentColor 14%, transparent) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
} as const;

const features = [
    {
        icon: <FormIcon />,
        title: "Build forms in minutes",
        text: "Add questions, reorder them and preview before you publish.",
    },
    {
        icon: <ChatIcon />,
        title: "Embed the chatbot",
        text: "Paste one snippet to add a chat widget to any website.",
    },
    {
        icon: <ChartIcon />,
        title: "Track every response",
        text: "See each submission and its timestamp in your dashboard.",
    },
];

/* ---------- Page ---------- */

const LoginPage = () => {
    const router = useRouter();
    const submitRef = useRef<HTMLButtonElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const adminFilled =
        email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;

    // Fills both fields, then moves focus to the Sign in button.
    const fillAdminCredentials = () => {
        setEmail(ADMIN_CREDENTIALS.email);
        setPassword(ADMIN_CREDENTIALS.password);
        setError("");
        requestAnimationFrame(() => submitRef.current?.focus());
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await authService.signIn({ email, password });
            console.log("loogin data : ", data)
            router.push("/");
        } catch (err) {
            setError(
                isAxiosError(err)
                    ? (err.response?.data?.message ??
                        "Could not sign in. Check your email and password.")
                    : "Something went wrong. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // 4rem = navbar height. Change it if your navbar is taller or shorter.
    return (
        <main className="grid min-h-[calc(100svh-4rem)] bg-background lg:grid-cols-2">
            {/* Brand panel (desktop only) */}
            <aside className="relative hidden items-center overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
                {/* Decorative shapes */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-foreground/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-primary-foreground/10" />

                <div className="relative w-full max-w-md">
                    <p className="text-sm font-medium text-primary-foreground/80">
                        Welcome back
                    </p>
                    <h2 className="mt-2 text-4xl font-semibold leading-tight tracking-tight">
                        Turn forms into conversations.
                    </h2>
                    <p className="mt-4 text-base text-primary-foreground/80">
                        Sign in to pick up where you left off. Your forms, chatbot and
                        responses are all waiting for you.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {features.map((f) => (
                            <li key={f.title} className="flex items-start gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                                    {f.icon}
                                </span>
                                <div>
                                    <p className="text-base font-semibold">{f.title}</p>
                                    <p className="mt-0.5 text-sm text-primary-foreground/75">
                                        {f.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Form panel */}
            <section
                className="flex items-center justify-center bg-muted/40 px-5 py-6 text-foreground sm:px-8"
                style={dotBackground}
            >
                <div className="w-full max-w-[25rem] rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/5">
                    <h1 className="text-xl font-semibold tracking-tight text-card-foreground">
                        Welcome back
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sign in to manage your forms and responses.
                    </p>

                    {/* Admin quick access */}
                    <button
                        type="button"
                        onClick={fillAdminCredentials}
                        className={`group mt-5 flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${adminFilled
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-card hover:border-primary/50 hover:bg-primary-soft"
                            }`}
                    >
                        <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${adminFilled
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                                }`}
                        >
                            {adminFilled ? <CheckIcon size={18} /> : <ShieldIcon />}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">
                                {adminFilled ? "Admin credentials filled" : "Sign in as admin"}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                                {adminFilled
                                    ? "Press Sign in to continue"
                                    : "Fill the form with the admin account"}
                            </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-teal px-2.5 py-0.5 text-xs font-medium text-teal-foreground">
                            Admin
                        </span>
                    </button>

                    <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        or continue with email
                        <span className="h-px flex-1 bg-border" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger-foreground"
                            >
                                <span className="mt-0.5 shrink-0">
                                    <AlertIcon />
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                                    <MailIcon />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className={`${inputBase} pl-11 pr-4`}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                                    <LockIcon />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`${inputBase} pl-11 pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <button
                            ref={submitRef}
                            type="submit"
                            disabled={loading || !email || !password}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Spinner />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowIcon />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don&rsquo;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;