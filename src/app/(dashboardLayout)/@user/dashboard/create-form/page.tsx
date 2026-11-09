"use client";

import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2, MessageCircle, Minus, RotateCcw, X } from "lucide-react";
import { createFormAction } from "@/actions/forms/forms.acton";

/* ------------------------------------------------------------------ */
/* Schema (mirrors your backend createFormSchema + widgetSettingsSchema) */
/* ------------------------------------------------------------------ */

const DOMAIN_RE = /^(?!-)([a-z0-9-]+\.)+[a-z]{2,}$/;
const hex = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Use a hex color like #4F46E5.");

const formSchema = z.object({
    title: z.string().trim().min(1, "Give your form a title.").max(120, "Keep the title under 120 characters."),
    description: z.string().max(500, "Keep the description under 500 characters."),
    botName: z.string().trim().min(1, "Your chatbot needs a name.").max(50),
    primaryColor: hex,
    backgroundColor: hex,
    textColor: hex,
    welcomeMessage: z.string().trim().min(1, "Add a welcome message.").max(300),
    completionMessage: z.string().trim().min(1, "Add a completion message.").max(300),
    launcherLabel: z.string().max(40),
    position: z.enum(["bottom-right", "bottom-left"]),
    allowedDomains: z.array(z.string().regex(DOMAIN_RE, "Use a domain like example.com.")).max(20, "You can add up to 20 domains."),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULTS: FormValues = {
    title: "",
    description: "",
    botName: "Assistant",
    primaryColor: "#4F46E5",
    backgroundColor: "#FFFFFF",
    textColor: "#0F172A",
    welcomeMessage: "Hi there! A few quick questions and we'll get you sorted.",
    completionMessage: "Thanks! We've got your answers and will be in touch soon.",
    launcherLabel: "Chat with us",
    position: "bottom-right",
    allowedDomains: [],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** First error message of a field, shown once the field has been touched. */
function errorOf(field: AnyFieldApi): string | undefined {
    if (!field.state.meta.isTouched) return undefined;
    const first = field.state.meta.errors[0] as unknown;
    if (!first) return undefined;
    return typeof first === "string" ? first : (first as { message?: string }).message;
}

/** Pick white or slate text depending on the colour behind it. */
function readableOn(color: string) {
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) return "#FFFFFF";
    let h = color.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return L > 0.45 ? "#0F172A" : "#FFFFFF";
}

const normalizeDomain = (raw: string) =>
    raw.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const inputCls =
    "w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground " +
    "placeholder:text-muted-foreground transition-colors focus-visible:outline-none " +
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 " +
    "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20";

function Field({
    label,
    hint,
    error,
    count,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    count?: string;
    children: ReactNode;
}) {
    return (
        <label className="block space-y-1.5">
            <span className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground">{label}</span>
                {count && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
            </span>
            {children}
            {error ? (
                <span role="alert" className="block text-xs text-danger-foreground">
                    {error}
                </span>
            ) : (
                hint && <span className="block text-xs text-muted-foreground">{hint}</span>
            )}
        </label>
    );
}

function ColorField({
    label,
    value,
    error,
    onChange,
    onBlur,
}: {
    label: string;
    value: string;
    error?: string;
    onChange: (v: string) => void;
    onBlur: () => void;
}) {
    return (
        <div className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <div
                className={`flex items-center gap-2 rounded-md border bg-surface p-1.5 focus-within:ring-2 ${error
                        ? "border-danger focus-within:ring-danger/20"
                        : "border-input focus-within:border-ring focus-within:ring-ring/25"
                    }`}
            >
                <input
                    type="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000"}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    aria-label={`${label} picker`}
                    className="size-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    onBlur={onBlur}
                    maxLength={7}
                    spellCheck={false}
                    aria-label={`${label} hex`}
                    aria-invalid={!!error}
                    className="w-full bg-transparent font-mono text-sm text-foreground focus:outline-none"
                />
            </div>
            {error && (
                <span role="alert" className="block text-xs text-danger-foreground">
                    {error}
                </span>
            )}
        </div>
    );
}

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="grid gap-5 border-b border-border px-6 py-7 last:border-b-0 sm:px-8">
            <div>
                <h2 className="text-base font-semibold text-foreground">{title}</h2>
                <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="grid gap-5">{children}</div>
        </section>
    );
}

/** Chip input bound to a TanStack field holding string[]. */
function DomainsInput({ field }: { field: AnyFieldApi }) {
    const [draft, setDraft] = useState("");
    const [draftError, setDraftError] = useState<string>();
    const domains = field.state.value as string[];

    const add = () => {
        const d = normalizeDomain(draft);
        if (!d) return setDraftError(undefined);
        if (!DOMAIN_RE.test(d)) return setDraftError("Use a domain like example.com.");
        if (domains.includes(d)) {
            setDraft("");
            return setDraftError(undefined);
        }
        field.handleChange([...domains, d]);
        setDraft("");
        setDraftError(undefined);
    };

    const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
        } else if (e.key === "Backspace" && !draft && domains.length) {
            field.handleChange(domains.slice(0, -1));
        }
    };

    return (
        <Field
            label="Add a domain"
            hint="Press Enter or comma to add."
            error={draftError ?? errorOf(field)}
        >
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-surface p-1.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
                {domains.map((d) => (
                    <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded bg-accent py-1 pl-2 pr-1 text-xs font-medium text-accent-foreground"
                    >
                        {d}
                        <button
                            type="button"
                            aria-label={`Remove ${d}`}
                            onClick={() => field.handleChange(domains.filter((x) => x !== d))}
                            className="rounded p-0.5 hover:bg-teal/25"
                        >
                            <X className="size-3" />
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKey}
                    onBlur={() => {
                        add();
                        field.handleBlur();
                    }}
                    placeholder={domains.length ? "" : "example.com"}
                    className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
            </div>
        </Field>
    );
}

/* ------------------------------------------------------------------ */
/* Live widget preview                                                 */
/* ------------------------------------------------------------------ */

function Bubble({ children, tone, bg }: { children: ReactNode; tone: string; bg: string }) {
    return (
        <div className="flex">
            <span
                className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2"
                style={{ color: tone, background: `color-mix(in srgb, ${tone} 8%, ${bg})` }}
            >
                {children}
            </span>
        </div>
    );
}

function WidgetPreview({ s }: { s: FormValues }) {
    const [stage, setStage] = useState<"welcome" | "completion">("welcome");
    const onPrimary = readableOn(s.primaryColor);
    const right = s.position === "bottom-right";
    const side = right ? "right-4 items-end" : "left-4 items-start";
    const site = s.allowedDomains[0] ?? "yourwebsite.com";

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Live preview</h2>
                <div className="inline-flex rounded-md bg-muted p-0.5 text-xs font-medium" role="tablist">
                    {(["welcome", "completion"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            role="tab"
                            aria-selected={stage === t}
                            onClick={() => setStage(t)}
                            className={`rounded px-2.5 py-1 capitalize transition-colors ${stage === t
                                    ? "bg-surface text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-[480px] overflow-hidden rounded-xl border border-border bg-muted">
                <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
                    <div className="flex-1 truncate rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">{site}</div>
                </div>
                <div className="space-y-3 p-5" aria-hidden>
                    <div className="h-3 w-1/3 rounded bg-border" />
                    <div className="h-2 w-2/3 rounded bg-border/70" />
                    <div className="h-2 w-1/2 rounded bg-border/70" />
                    <div className="mt-5 h-24 rounded-lg bg-border/50" />
                </div>

                <div className={`absolute bottom-4 flex flex-col gap-3 ${side}`}>
                    <div
                        className="w-[260px] overflow-hidden rounded-2xl border border-black/5 shadow-xl"
                        style={{ background: s.backgroundColor, color: s.textColor }}
                    >
                        <div
                            className="flex items-center gap-2 px-4 py-3"
                            style={{ background: s.primaryColor, color: onPrimary }}
                        >
                            <div
                                className="grid size-7 place-items-center rounded-full text-xs font-semibold"
                                style={{ background: onPrimary, color: s.primaryColor }}
                            >
                                {(s.botName.trim()[0] ?? "A").toUpperCase()}
                            </div>
                            <span className="flex-1 truncate text-sm font-medium">{s.botName.trim() || "Assistant"}</span>
                            <Minus className="size-4 opacity-80" />
                        </div>

                        <div className="space-y-2 px-3 py-4 text-[13px] leading-snug">
                            <Bubble tone={s.textColor} bg={s.backgroundColor}>
                                {s.welcomeMessage || "Your welcome message appears here."}
                            </Bubble>
                            {stage === "completion" && (
                                <>
                                    <div className="flex justify-end">
                                        <span
                                            className="max-w-[80%] rounded-2xl rounded-br-sm px-3 py-2"
                                            style={{ background: s.primaryColor, color: onPrimary }}
                                        >
                                            sam@acme.com
                                        </span>
                                    </div>
                                    <Bubble tone={s.textColor} bg={s.backgroundColor}>
                                        {s.completionMessage || "Your completion message appears here."}
                                    </Bubble>
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg"
                        style={{ background: s.primaryColor, color: onPrimary }}
                    >
                        <MessageCircle className={s.launcherLabel.trim() ? "size-4" : "size-5"} />
                        {s.launcherLabel.trim()}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CreateForms() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: DEFAULTS,
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                const res: any = await createFormAction({
                    title: value.title.trim(),
                    description: value.description.trim() || null,
                    widgetSettings: {
                        botName: value.botName.trim(),
                        primaryColor: value.primaryColor,
                        backgroundColor: value.backgroundColor,
                        textColor: value.textColor,
                        welcomeMessage: value.welcomeMessage.trim(),
                        completionMessage: value.completionMessage.trim(),
                        launcherLabel: value.launcherLabel.trim() || null,
                        position: value.position,
                        allowedDomains: value.allowedDomains,
                    },
                } as any);

                // Navigate only when the response clearly says it worked ({ ok }, { success }, or a created form with an id).
                const created =
                    res?.ok === true ||
                    res?.success === true ||
                    Boolean(res?.id ?? res?._id ?? res?.data?.id ?? res?.data?._id);

                if (!created) {
                    console.error("createFormAction response:", res);
                    return setServerError(
                        res?.message ?? res?.error ?? "The form was not created. Check the server response in the console."
                    );
                }

                form.reset();
                router.push("/dashboard");
                router.refresh();
            } catch (err: any) {
                setServerError(err?.message ?? "Something went wrong while creating the form.");
            }
        },
    });

    // Start from a clean form every time this page is opened. Next.js can keep a page's
    // state alive when you navigate away, so reset it when the page is left too.
    useEffect(() => {
        return () => form.reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8 max-w-2xl">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Create a form</h1>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Name your form and style the chatbot that collects responses. You can change everything later.
                </p>
            </header>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
                {/* ---------- Form ---------- */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    noValidate
                    className="overflow-hidden rounded-xl border border-border bg-card"
                >
                    <Section title="Basics" description="What people will see in your dashboard.">
                        <form.Field name="title">
                            {(field) => (
                                <Field label="Title" error={errorOf(field)} count={`${field.state.value.length}/120`}>
                                    <input
                                        className={inputCls}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Customer feedback"
                                        maxLength={120}
                                        aria-invalid={!!errorOf(field)}
                                        autoFocus
                                    />
                                </Field>
                            )}
                        </form.Field>

                        <form.Field name="description">
                            {(field) => (
                                <Field
                                    label="Description"
                                    hint="Optional. A short note for your team."
                                    error={errorOf(field)}
                                    count={`${field.state.value.length}/500`}
                                >
                                    <textarea
                                        className={`${inputCls} min-h-24 resize-y`}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder="Collects feedback after a purchase"
                                        maxLength={500}
                                        aria-invalid={!!errorOf(field)}
                                    />
                                </Field>
                            )}
                        </form.Field>
                    </Section>

                    <Section title="Chatbot look" description="Colors and placement of the widget on your site.">
                        <form.Field name="botName">
                            {(field) => (
                                <Field label="Bot name" error={errorOf(field)} count={`${field.state.value.length}/50`}>
                                    <input
                                        className={inputCls}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        maxLength={50}
                                        aria-invalid={!!errorOf(field)}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        <div className="-mb-2 flex min-h-6 items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Colors</span>
                            <form.Subscribe
                                selector={(st) =>
                                    st.values.primaryColor !== DEFAULTS.primaryColor ||
                                    st.values.backgroundColor !== DEFAULTS.backgroundColor ||
                                    st.values.textColor !== DEFAULTS.textColor
                                }
                            >
                                {(changed) =>
                                    changed ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                form.setFieldValue("primaryColor", DEFAULTS.primaryColor);
                                                form.setFieldValue("backgroundColor", DEFAULTS.backgroundColor);
                                                form.setFieldValue("textColor", DEFAULTS.textColor);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-soft"
                                        >
                                            <RotateCcw className="size-3.5" />
                                            Reset to default
                                        </button>
                                    ) : null
                                }
                            </form.Subscribe>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <form.Field name="primaryColor">
                                {(field) => (
                                    <ColorField
                                        label="Primary"
                                        value={field.state.value}
                                        error={errorOf(field)}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                    />
                                )}
                            </form.Field>
                            <form.Field name="backgroundColor">
                                {(field) => (
                                    <ColorField
                                        label="Background"
                                        value={field.state.value}
                                        error={errorOf(field)}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                    />
                                )}
                            </form.Field>
                            <form.Field name="textColor">
                                {(field) => (
                                    <ColorField
                                        label="Text"
                                        value={field.state.value}
                                        error={errorOf(field)}
                                        onChange={field.handleChange}
                                        onBlur={field.handleBlur}
                                    />
                                )}
                            </form.Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <form.Field name="launcherLabel">
                                {(field) => (
                                    <Field label="Launcher label" hint="Leave empty for an icon-only button." error={errorOf(field)}>
                                        <input
                                            className={inputCls}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            maxLength={40}
                                        />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field name="position">
                                {(field) => (
                                    <div className="space-y-1.5">
                                        <span className="text-sm font-medium text-foreground">Position</span>
                                        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Widget position">
                                            {(["bottom-left", "bottom-right"] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={field.state.value === p}
                                                    onClick={() => field.handleChange(p)}
                                                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${field.state.value === p
                                                            ? "border-primary bg-primary-soft font-medium text-primary-hover dark:text-foreground"
                                                            : "border-input bg-surface text-muted-foreground hover:text-foreground"
                                                        }`}
                                                >
                                                    {p === "bottom-left" ? "Bottom left" : "Bottom right"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        </div>
                    </Section>

                    <Section title="Messages" description="What the chatbot says at the start and at the end.">
                        <form.Field name="welcomeMessage">
                            {(field) => (
                                <Field label="Welcome message" error={errorOf(field)} count={`${field.state.value.length}/300`}>
                                    <textarea
                                        className={`${inputCls} min-h-20 resize-y`}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        maxLength={300}
                                        aria-invalid={!!errorOf(field)}
                                    />
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="completionMessage">
                            {(field) => (
                                <Field label="Completion message" error={errorOf(field)} count={`${field.state.value.length}/300`}>
                                    <textarea
                                        className={`${inputCls} min-h-20 resize-y`}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        maxLength={300}
                                        aria-invalid={!!errorOf(field)}
                                    />
                                </Field>
                            )}
                        </form.Field>
                    </Section>

                    <Section
                        title="Allowed domains"
                        description="The chatbot only loads on these sites. Leave empty to allow any site while you test."
                    >
                        <form.Field name="allowedDomains">{(field) => <DomainsInput field={field} />}</form.Field>
                    </Section>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 border-t border-border bg-muted/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <p role="alert" className="min-h-5 text-sm text-danger-foreground">
                            {serverError}
                        </p>
                        <form.Subscribe selector={(st) => st.isSubmitting}>
                            {(isSubmitting) => (
                                <div className="flex items-center gap-2 self-end">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                        className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSubmitting && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />}
                                        {isSubmitting ? "Creating form" : "Create form"}
                                    </button>
                                </div>
                            )}
                        </form.Subscribe>
                    </div>
                </form>

                {/* ---------- Preview ---------- */}
                <aside className="lg:sticky lg:top-6">
                    <form.Subscribe selector={(st) => st.values}>{(values) => <WidgetPreview s={values} />}</form.Subscribe>
                </aside>
            </div>
        </div>
    );
}