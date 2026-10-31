"use client";

import { useState, type SVGProps } from "react";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";
import { Montserrat } from "next/font/google";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import authService from "@/services/auth.sevices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

// Admin quick-fill credentials (shown in all environments, including production).
const ADMIN_CREDENTIALS = {
    email: "admin@gmail.com",
    password: "12345678",
};

//    Validation schema

const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof loginSchema>;

//    Helpers & icons

// Pulls the first readable message out of TanStack's error array.
const firstError = (errors: unknown[]): string | undefined => {
    for (const e of errors) {
        if (!e) continue;
        if (typeof e === "string") return e;
        if (typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
    }
    return undefined;
};

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

const CheckIcon = () => (
    <svg {...iconProps} strokeWidth={2.2}>
        <path d="m5 12 5 5 9-10" />
    </svg>
);

const AlertIcon = () => (
    <svg {...iconProps} width={16} height={16}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

//    Styles & data

const inputClass =
    "h-auto rounded-lg border-0 bg-[#eee] px-[15px] py-2.5 text-[13px] shadow-none outline-none dark:bg-[#eee] dark:text-black placeholder:text-muted-foreground/70 aria-invalid:ring-2 aria-invalid:ring-danger-foreground/50 focus-visible:ring-2 focus-visible:ring-[#512da8]/40";

const highlights = [
    "Build forms with text, email, multiple choice and yes/no questions",
    "Embed the chatbot widget on any website with one snippet",
    "Track every response and its timestamp in your dashboard",
];

//    Page

const LoginPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const form = useForm({
        defaultValues: { email: "", password: "" } as LoginValues,
        validators: { onChange: loginSchema },
        onSubmit: async ({ value }: { value: LoginValues }) => {
            setServerError("");
            try {
                await authService.signIn({
                    email: value.email.trim(),
                    password: value.password,
                });
                router.push("/");
            } catch (err) {
                setServerError(
                    isAxiosError(err)
                        ? (err.response?.data?.message ??
                            "Could not sign in. Check your email and password.")
                        : "Something went wrong. Try again."
                );
            }
        },
    });

    // Fills both fields, then moves focus to the Sign in button.
    const fillAdminCredentials = () => {
        form.setFieldValue("email", ADMIN_CREDENTIALS.email);
        form.setFieldValue("password", ADMIN_CREDENTIALS.password);
        setServerError("");
        requestAnimationFrame(() => document.getElementById("login-submit")?.focus());
    };

    // 4rem = navbar height. Change it if your navbar is taller or shorter.
    return (
        <main
            className={`${montserrat.className} flex min-h-[calc(100svh-4rem)] items-center justify-center bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff] px-4 py-8`}
        >
            <div className="grid w-full max-w-[768px] overflow-hidden rounded-[30px] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] md:min-h-[480px] md:grid-cols-2">
                {/* Purple panel (top on mobile, right on desktop) */}
                <aside className="flex flex-col items-center justify-center rounded-b-[40px] bg-linear-to-r from-[#5c6bc0] to-[#512da8] px-6 py-10 text-center text-white md:order-2 md:rounded-[150px_0_0_100px] md:px-8 md:py-12">
                    <h2 className="text-2xl font-bold leading-tight md:text-[26px]">
                        Pick up where you left off
                    </h2>
                    <p className="mt-3 max-w-[20rem] text-sm leading-5 tracking-[0.3px]">
                        Your forms, chatbot and responses are all waiting for you in one
                        dashboard.
                    </p>

                    <ul className="mt-4 hidden max-w-[18rem] space-y-2 text-left text-[13px] md:block">
                        {highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span aria-hidden className="mt-0.5 text-white/90">✓</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Sign in form */}
                <section className="flex flex-col items-center justify-center px-6 py-10 md:order-1 md:px-10 md:py-12">
                    <h1 className="text-center text-2xl font-bold text-black md:text-[26px]">
                        Sign In
                    </h1>
                    <p className="mt-1 text-center text-xs text-black">
                        Sign in to manage your forms and responses
                    </p>

                    {/* Admin quick access */}
                    <form.Subscribe selector={(state) => state.values}>
                        {(values) => {
                            const adminFilled =
                                values.email === ADMIN_CREDENTIALS.email &&
                                values.password === ADMIN_CREDENTIALS.password;
                            return (
                                <button
                                    type="button"
                                    onClick={fillAdminCredentials}
                                    className={`mt-5 flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#512da8]/40 ${adminFilled
                                        ? "border-[#512da8] bg-[#512da8]/10"
                                        : "border-[#ccc] bg-white hover:border-[#512da8] hover:bg-[#512da8]/5"
                                        }`}
                                >
                                    <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${adminFilled
                                            ? "bg-[#512da8] text-white"
                                            : "bg-[#512da8]/10 text-[#512da8]"
                                            }`}
                                    >
                                        {adminFilled ? <CheckIcon /> : <ShieldIcon />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[13px] font-semibold text-black">
                                            {adminFilled ? "Admin credentials filled" : "Sign in as admin"}
                                        </span>
                                        <span className="block truncate text-xs text-[#555]">
                                            {adminFilled
                                                ? "Press Sign in to continue"
                                                : "Fill the form with the admin account"}
                                        </span>
                                    </span>
                                    <span className="shrink-0 rounded-full bg-[#512da8]/10 px-2.5 py-0.5 text-xs font-semibold text-[#512da8]">
                                        Admin
                                    </span>
                                </button>
                            );
                        }}
                    </form.Subscribe>

                    <p className="mt-4 text-center text-xs text-black">or use your email and password</p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="mt-3 w-full space-y-2"
                        noValidate
                    >
                        {serverError && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger-foreground"
                            >
                                <span className="mt-px shrink-0">
                                    <AlertIcon />
                                </span>
                                <span>{serverError}</span>
                            </div>
                        )}

                        {/* Email */}
                        <form.Field name="email">
                            {(field: AnyFieldApi) => {
                                const error = field.state.meta.isTouched
                                    ? firstError(field.state.meta.errors)
                                    : undefined;
                                return (
                                    <div className="grid gap-1">
                                        <Label htmlFor={field.name} className="sr-only">
                                            Email address
                                        </Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Email"
                                            className={inputClass}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={!!error}
                                            aria-describedby={error ? `${field.name}-error` : undefined}
                                        />
                                        {error && (
                                            <p id={`${field.name}-error`} className="text-xs text-danger-foreground">
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        </form.Field>

                        {/* Password */}
                        <form.Field name="password">
                            {(field: AnyFieldApi) => {
                                const error = field.state.meta.isTouched
                                    ? firstError(field.state.meta.errors)
                                    : undefined;
                                return (
                                    <div className="grid gap-1">
                                        <Label htmlFor={field.name} className="sr-only">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className={`${inputClass} pr-10`}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={!!error}
                                                aria-describedby={error ? `${field.name}-error` : undefined}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                aria-pressed={showPassword}
                                                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#512da8]/40"
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                        {error && (
                                            <p id={`${field.name}-error`} className="text-xs text-danger-foreground">
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        </form.Field>

                        <form.Subscribe selector={(state) => state.isSubmitting}>
                            {(isSubmitting) => (
                                <Button
                                    id="login-submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-3 h-auto w-full gap-2 rounded-lg bg-[#512da8] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.5px] text-white hover:bg-[#45268f] focus-visible:ring-2 focus-visible:ring-[#512da8]/40"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner />
                                            Signing in…
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>

                    <p className="mt-5 text-center text-sm text-[#555]">
                        Don&rsquo;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-[#512da8] hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                            Create an account
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
};

export default LoginPage;