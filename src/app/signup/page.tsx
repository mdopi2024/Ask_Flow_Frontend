"use client";

import {
    cloneElement,
    createContext,
    useContext,
    useId,
    useState,
    type ComponentProps,
    type ReactElement,
    type ReactNode,
    type SVGProps,
} from "react";
import {
    Controller,
    FormProvider,
    useForm,
    useFormContext,
    useFormState,
    type ControllerProps,
    type ControllerRenderProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import authService from "@/services/auth.sevices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


//    shadcn-style Form helpers (kept in this file so nothing else is needed)


const Form = FormProvider;

type FormFieldContextValue = { name: string };
const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
    props: ControllerProps<TFieldValues, TName>
) => (
    <FormFieldContext.Provider value={{ name: props.name }}>
        <Controller {...props} />
    </FormFieldContext.Provider>
);

type FormItemContextValue = { id: string };
const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const useFormField = () => {
    const fieldContext = useContext(FormFieldContext);
    const itemContext = useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);
    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

const FormItem = ({ className = "", ...props }: ComponentProps<"div">) => {
    const id = useId();
    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={`grid gap-1.5 ${className}`} {...props} />
        </FormItemContext.Provider>
    );
};

const FormLabel = ({ className = "", ...props }: ComponentProps<"label">) => {
    const { formItemId } = useFormField();
    return (
        <label
            htmlFor={formItemId}
            className={`text-sm font-medium leading-none text-foreground ${className}`}
            {...props}
        />
    );
};

// Passes id / aria attributes down to its single child (the input).
const FormControl = ({ children }: { children: ReactElement<Record<string, unknown>> }) => {
    const { error, formItemId, formMessageId } = useFormField();
    return cloneElement(children, {
        id: formItemId,
        "aria-describedby": error ? formMessageId : undefined,
        "aria-invalid": !!error,
    });
};

const FormMessage = ({ className = "", children, ...props }: ComponentProps<"p">) => {
    const { error, formMessageId } = useFormField();
    const body: ReactNode = error ? String(error.message ?? "") : children;
    if (!body) return null;
    return (
        <p id={formMessageId} className={`text-xs text-danger-foreground ${className}`} {...props}>
            {body}
        </p>
    );
};


//    Inline icons (no extra dependency)


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

const UserIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

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

//    Validation schema


const signupSchema = z
    .object({
        name: z.string().trim().min(2, "Enter your full name."),
        email: z.string().trim().email("Enter a valid email address."),
        password: z.string().min(8, "Use at least 8 characters."),
        confirm: z.string().min(1, "Confirm your password."),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords do not match.",
        path: ["confirm"],
    });

type SignupValues = z.infer<typeof signupSchema>;

// Explicit render-prop type, so `field` is never implicitly "any".
type FieldProps<K extends keyof SignupValues> = {
    field: ControllerRenderProps<SignupValues, K>;
};


//    Styles & data


const inputClass =
    "h-11 rounded-xl border-input bg-surface text-sm aria-invalid:border-danger-foreground/60 focus-visible:ring-4 focus-visible:ring-primary/15";
const iconWrap =
    "pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3.5 text-muted-foreground";

// Soft dotted background for the form side (adapts to light/dark via currentColor).
const dotBackground = {
    backgroundImage:
        "radial-gradient(circle, color-mix(in srgb, currentColor 14%, transparent) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
} as const;

const steps = [
    {
        title: "Create a form",
        text: "Add text, email, multiple choice and yes/no questions.",
    },
    {
        title: "Publish and embed",
        text: "Share a public link or paste one snippet on your website.",
    },
    {
        title: "Collect responses",
        text: "Review every submission from your dashboard.",
    },
];



const SignupPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "", confirm: "" },
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values: SignupValues) => {
        setServerError("");

        try {
            // Adjust the method name / payload to match your auth service.
            await authService.signUp({
                name: values.name,
                email: values.email,
                password: values.password,
            });
            router.push("/");
        } catch (err) {
            setServerError(
                isAxiosError(err)
                    ? (err.response?.data?.message ??
                        "Could not create your account. Try again.")
                    : "Something went wrong. Try again."
            );
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
                        Get started for free
                    </p>
                    <h2 className="mt-2 text-4xl font-semibold leading-tight tracking-tight">
                        Create your account in under a minute.
                    </h2>
                    <p className="mt-4 text-base text-primary-foreground/80">
                        Set up your workspace and start collecting responses with a chatbot
                        on your own website.
                    </p>

                    <ol className="mt-10 space-y-5">
                        {steps.map((step, i) => (
                            <li key={step.title} className="flex items-start gap-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-semibold">
                                    {i + 1}
                                </span>
                                <div>
                                    <p className="text-base font-semibold">{step.title}</p>
                                    <p className="mt-0.5 text-sm text-primary-foreground/75">
                                        {step.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </aside>

            {/* Form panel */}
            <section
                className="flex items-center justify-center bg-muted/40 px-5 py-6 text-foreground sm:px-8"
                style={dotBackground}
            >
                <div className="w-full max-w-[25rem] rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/5">
                    <h1 className="text-xl font-semibold tracking-tight text-card-foreground">
                        Create your account
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Fill in your details to get started.
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-5 space-y-3.5"
                            noValidate
                        >
                            {serverError && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger-foreground"
                                >
                                    <span className="mt-0.5 shrink-0">
                                        <AlertIcon />
                                    </span>
                                    <span>{serverError}</span>
                                </div>
                            )}

                            {/* Full name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }: FieldProps<"name">) => (
                                    <FormItem>
                                        <FormLabel>Full name</FormLabel>
                                        <div className="relative">
                                            <span className={iconWrap}>
                                                <UserIcon />
                                            </span>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="Your full name"
                                                    className={`${inputClass} pl-11 pr-4`}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }: FieldProps<"email">) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <div className="relative">
                                            <span className={iconWrap}>
                                                <MailIcon />
                                            </span>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="you@company.com"
                                                    className={`${inputClass} pl-11 pr-4`}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }: FieldProps<"password">) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="relative">
                                            <span className={iconWrap}>
                                                <LockIcon />
                                            </span>
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    placeholder="At least 8 characters"
                                                    className={`${inputClass} pl-11 pr-12`}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                aria-label={
                                                    showPassword ? "Hide passwords" : "Show passwords"
                                                }
                                                aria-pressed={showPassword}
                                                className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm password */}
                            <FormField
                                control={form.control}
                                name="confirm"
                                render={({ field }: FieldProps<"confirm">) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <div className="relative">
                                            <span className={iconWrap}>
                                                <LockIcon />
                                            </span>
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    placeholder="Re-enter your password"
                                                    className={`${inputClass} pl-11 pr-4`}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="!mt-5 h-11 w-full gap-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 focus-visible:ring-4 focus-visible:ring-primary/30 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowIcon />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignupPage;