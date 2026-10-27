"use client";

import { useCallback, useEffect, useRef, useState } from "react";


export type Question = {
    id: string;
    type: "text" | "email" | "choice" | "yesno";
    label: string;
    required: boolean;
    options?: string[];
};

export type Answers = Record<string, string>;

type Msg = { id: number; from: "bot" | "user"; text: string };

export type ChatWidgetProps = {
    questions: Question[];
    welcomeText?: string;
    doneText?: string;
    title?: string;
    /** Small line under the title in the header. */
    subtitle?: string;
    /** Placeholder for the text input. */
    placeholder?: string;
    /** Footer text. Pass "" to hide it. */
    poweredByText?: string;
    /** Any CSS color. Falls back to --widget-color / --primary. */
    color?: string;
    /** Called once, right after the last question is answered. */
    onComplete?: (answers: Answers) => void;
    /** Shows a close button in the header when provided. */
    onClose?: () => void;
    className?: string;
};



export function validate(q: Question, raw: string): string | null {
    const v = raw.trim();
    if (!v) return q.required ? "This question is required." : null;
    if (v.length > 1000) return "Answer is too long (max 1000 characters).";
    if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        return "Please enter a valid email address.";
    }
    if (q.type === "yesno" && v !== "Yes" && v !== "No") {
        return "Please choose Yes or No.";
    }
    if (q.type === "choice" && !(q.options ?? []).includes(v)) {
        return "Please choose one of the options.";
    }
    return null;
}



const Icon = {
    chat: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.5-.7L3 21l1.9-5A8.4 8.4 0 1 1 21 11.5Z" />
        </svg>
    ),
    close: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    ),
    restart: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    ),
    send: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
            <path d="M22 2 11 13" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12 5 5L20 7" />
        </svg>
    ),
};



export function ChatWidget({
    questions,
    welcomeText = "Hi there! 👋 Mind answering a few quick questions?",
    doneText = "Thanks! Your response has been recorded.",
    title = "Assistant",
    subtitle = "Online now",
    placeholder,
    poweredByText = "Powered by your form builder",
    color,
    onComplete,
    onClose,
    className = "",
}: ChatWidgetProps) {
    const [step, setStep] = useState(0);
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [typing, setTyping] = useState(false);
    const [done, setDone] = useState(false);

    const answers = useRef<Answers>({});
    const timers = useRef<number[]>([]);
    const nextId = useRef(0);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const q: Question | undefined = questions[step];

    const clearTimers = useCallback(() => {
        timers.current.forEach(window.clearTimeout);
        timers.current = [];
    }, []);

    const say = useCallback((texts: string[], then?: () => void) => {
        if (texts.length === 0) {
            then?.();
            return;
        }
        setTyping(true);
        let delay = 0;
        texts.forEach((text, i) => {
            delay += 650;
            timers.current.push(
                window.setTimeout(() => {
                    setMsgs((m) => [...m, { id: nextId.current++, from: "bot", text }]);
                    if (i === texts.length - 1) {
                        setTyping(false);
                        then?.();
                    }
                }, delay)
            );
        });
    }, []);

    const start = useCallback(() => {
        clearTimers();
        answers.current = {};
        setStep(0);
        setMsgs([]);
        setInput("");
        setError("");
        setDone(false);
        setTyping(false);
        if (questions.length === 0) {
            say([welcomeText]);
            return;
        }
        say([welcomeText, questions[0].label]);
    }, [questions, welcomeText, say, clearTimers]);

    useEffect(() => {
        start();
        return clearTimers;
    }, [start, clearTimers]);

    // Scroll only the chat list, so the page itself never jumps.
    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [msgs, typing, error]);

    // Put the cursor back in the box once the bot has finished talking.
    useEffect(() => {
        if (!typing && !done && (q?.type === "text" || q?.type === "email")) {
            inputRef.current?.focus({ preventScroll: true });
        }
    }, [typing, done, q]);

    function submit(value: string) {
        if (done || typing || !q) return;
        const err = validate(q, value);
        if (err) {
            setError(err);
            return;
        }
        setError("");
        setInput("");

        const clean = value.trim();
        answers.current = { ...answers.current, [q.id]: clean };
        setMsgs((m) => [
            ...m,
            { id: nextId.current++, from: "user", text: clean || "Skipped" },
        ]);

        if (step + 1 < questions.length) {
            setStep(step + 1);
            say([questions[step + 1].label]);
        } else {
            setDone(true);
            // Save immediately so a quick restart can never lose the response.
            onCompleteRef.current?.(answers.current);
            say([doneText]);
        }
    }

    const buttons =
        q?.type === "yesno" ? ["Yes", "No"] : q?.type === "choice" ? (q.options ?? []) : null;

    const progress = done ? 100 : questions.length ? Math.round((step / questions.length) * 100) : 0;

    return (
        <div
            style={color ? ({ "--widget-color": color } as React.CSSProperties) : undefined}
            className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl ${className}`}
        >
            {/* Header */}
            <div className="bg-widget text-white">
                <div className="flex items-center gap-3 px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">
                        {Icon.chat}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
                        {subtitle && (
                            <p className="flex items-center gap-1.5 text-xs text-white/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={start}
                        aria-label="Start over"
                        title="Start over"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 focus-visible:outline-white"
                    >
                        {Icon.restart}
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close chat"
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 focus-visible:outline-white"
                        >
                            {Icon.close}
                        </button>
                    )}
                </div>
                <div
                    className="h-1 bg-white/20"
                    role="progressbar"
                    aria-label="Progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div
                        className="h-full bg-white transition-[width] duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Messages */}
            <div
                ref={listRef}
                className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-muted/50 p-4"
                role="log"
                aria-live="polite"
            >
                {msgs.map((m) => (
                    <div
                        key={m.id}
                        className={`animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none max-w-[82%] break-words px-3.5 py-2 text-sm leading-relaxed ${m.from === "user"
                            ? "self-end rounded-2xl rounded-br-md bg-widget text-white"
                            : "self-start rounded-2xl rounded-bl-md border border-border bg-surface text-foreground shadow-sm"
                            }`}
                    >
                        {m.text}
                    </div>
                ))}

                {typing && (
                    <div
                        className="flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-3 shadow-sm"
                        aria-label="Assistant is typing"
                    >
                        {[0, 150, 300].map((d) => (
                            <span
                                key={d}
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                                style={{ animationDelay: `${d}ms` }}
                            />
                        ))}
                    </div>
                )}

                {done && !typing && (
                    <div className="mt-1 flex items-center gap-2 self-center rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success-foreground">
                        {Icon.check}
                        Response saved
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="border-t border-border bg-surface p-3">
                {done ? (
                    <button
                        type="button"
                        onClick={start}
                        className="w-full rounded-xl border border-border py-2 text-sm font-medium text-widget hover:bg-muted"
                    >
                        Start again
                    </button>
                ) : (
                    q && (
                        <>
                            {error && (
                                <p role="alert" className="mb-2 text-xs font-medium text-danger">
                                    {error}
                                </p>
                            )}

                            {buttons ? (
                                <div className="flex flex-wrap gap-2">
                                    {buttons.map((b) => (
                                        <button
                                            key={b}
                                            type="button"
                                            disabled={typing}
                                            onClick={() => submit(b)}
                                            className="rounded-full border border-widget px-4 py-1.5 text-sm font-medium text-widget transition-colors hover:bg-widget hover:text-white disabled:pointer-events-none disabled:opacity-40"
                                        >
                                            {b}
                                        </button>
                                    ))}
                                    {!q.required && (
                                        <button
                                            type="button"
                                            disabled={typing}
                                            onClick={() => submit("")}
                                            className="rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted disabled:opacity-40"
                                        >
                                            Skip
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        submit(input);
                                    }}
                                    className="flex items-center gap-2"
                                    noValidate
                                >
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            if (error) setError("");
                                        }}
                                        disabled={typing}
                                        type={q.type === "email" ? "email" : "text"}
                                        inputMode={q.type === "email" ? "email" : "text"}
                                        autoComplete={q.type === "email" ? "email" : "off"}
                                        placeholder={
                                            placeholder ??
                                            (q.required ? "Type your answer…" : "Type your answer (optional)…")
                                        }
                                        aria-label="Your answer"
                                        aria-invalid={!!error}
                                        // 16px on mobile avoids iOS zoom-on-focus
                                        className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-widget focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-widget/30 disabled:opacity-60 sm:text-sm"
                                    />
                                    {!q.required && (
                                        <button
                                            type="button"
                                            disabled={typing}
                                            onClick={() => submit("")}
                                            className="shrink-0 rounded-xl px-2.5 py-2.5 text-sm text-muted-foreground hover:bg-muted disabled:opacity-40"
                                        >
                                            Skip
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={typing}
                                        aria-label="Send"
                                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-widget text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                                    >
                                        {Icon.send}
                                    </button>
                                </form>
                            )}
                        </>
                    )
                )}
            </div>

            {poweredByText && (
                <p className="border-t border-border bg-surface py-2 text-center text-[11px] text-muted-foreground">
                    {poweredByText}
                </p>
            )}
        </div>
    );
}



export type FloatingChatWidgetProps = ChatWidgetProps & {
    position?: "right" | "left";
    defaultOpen?: boolean;
};

export function FloatingChatWidget({
    position = "right",
    defaultOpen = false,
    onClose,
    color,
    ...props
}: FloatingChatWidgetProps) {
    const [open, setOpen] = useState(defaultOpen);
    const side = position === "left" ? "left-4 origin-bottom-left" : "right-4 origin-bottom-right";

    return (
        <div style={color ? ({ "--widget-color": color } as React.CSSProperties) : undefined}>
            {/* Kept mounted so the conversation survives open/close */}
            <div
                aria-hidden={!open}
                className={`fixed bottom-24 z-50 h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] transition duration-200 sm:w-[380px] ${side} ${open
                    ? "scale-100 opacity-100"
                    : "pointer-events-none invisible scale-95 opacity-0"
                    }`}
            >
                <ChatWidget
                    {...props}
                    onClose={() => {
                        setOpen(false);
                        onClose?.();
                    }}
                />
            </div>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close chat" : "Open chat"}
                aria-expanded={open}
                className={`fixed bottom-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-widget text-white shadow-lg transition hover:scale-105 hover:brightness-110 active:scale-95 ${position === "left" ? "left-4" : "right-4"}`}
            >
                {open ? Icon.close : Icon.chat}
            </button>
        </div>
    );
}



const DEMO_QUESTIONS: Question[] = [
    { id: "name", type: "text", label: "What’s your name?", required: true },
    { id: "email", type: "email", label: "What’s your email?", required: true },
    {
        id: "source",
        type: "choice",
        label: "How did you hear about us?",
        required: false,
        options: ["Search", "A friend", "Social media"],
    },
    { id: "recommend", type: "yesno", label: "Would you recommend us?", required: true },
];

const SWATCHES = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Teal", value: "#0d9488" },
    { name: "Rose", value: "#e11d48" },
    { name: "Slate", value: "#334155" },
];

const DEMO_FEATURES = [
    { title: "Chat-style forms", text: "Ask one question at a time, like a real conversation." },
    { title: "Easy to embed", text: "Paste one script tag and the widget appears on your site." },
    { title: "Instant responses", text: "Every answer is saved and visible in your dashboard." },
];

export default function DemoChat() {
    const [open, setOpen] = useState(true);
    const [color, setColor] = useState(SWATCHES[0].value);

    return (
        <div className="mx-auto w-full mt-15 max-w-3xl">
            <p className="mb-4 text-center text-sm text-muted-foreground">
                This is how the chatbot looks on your own website. Try answering the questions below.
            </p>

            {/* Browser frame */}
            <div
                style={{ "--widget-color": color } as React.CSSProperties}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
            >
                <div className="flex items-center gap-3 border-b border-border bg-muted px-4 py-2.5">
                    <div className="flex gap-1.5" aria-hidden>
                        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                    </div>
                    <div className="mx-auto w-full max-w-xs truncate rounded-md bg-background px-3 py-1 text-center text-xs text-muted-foreground">
                        yourwebsite.com
                    </div>
                    <span className="w-10" aria-hidden />
                </div>

                {/* Fake page + floating widget */}
                <div className="relative h-[560px] overflow-hidden bg-background">
                    <div className="space-y-6 p-6 sm:p-8">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-foreground">YourBrand</span>
                            <nav className="hidden gap-4 text-xs text-muted-foreground sm:flex" aria-hidden>
                                <span>Home</span>
                                <span>Products</span>
                                <span>Pricing</span>
                                <span>Contact</span>
                            </nav>
                        </div>

                        <div className="space-y-3 pt-4">
                            <h3 className="max-w-md text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                                Welcome to your website
                            </h3>
                            <p className="max-w-md text-sm text-muted-foreground">
                                Visitors can chat with your assistant, answer a few quick questions and
                                leave their details without ever filling in a long form.
                            </p>
                            <div className="flex gap-2 pt-1" aria-hidden>
                                <span className="rounded-lg bg-widget px-3.5 py-1.5 text-xs font-medium text-white">
                                    Get started
                                </span>
                                <span className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-foreground">
                                    Learn more
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                            {DEMO_FEATURES.map((f) => (
                                <div key={f.title} className="rounded-xl bg-foreground/5 p-3">
                                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel (kept mounted so the conversation survives open/close) */}
                    <div
                        aria-hidden={!open}
                        className={`absolute bottom-20 right-3 h-[min(460px,calc(100%-6rem))] w-[calc(100%-1.5rem)] origin-bottom-right transition duration-200 sm:right-4 sm:w-[360px] ${open
                            ? "scale-100 opacity-100"
                            : "pointer-events-none invisible scale-95 opacity-0"
                            }`}
                    >
                        <ChatWidget
                            title="Assistant"
                            questions={DEMO_QUESTIONS}
                            onClose={() => setOpen(false)}
                        />
                    </div>

                    {/* Floating launcher */}
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-label={open ? "Close chat" : "Open chat"}
                        aria-expanded={open}
                        className="absolute bottom-4 right-3 grid h-14 w-14 place-items-center rounded-full bg-widget text-white shadow-lg transition hover:scale-105 hover:brightness-110 active:scale-95 sm:right-4"
                    >
                        {open ? Icon.close : Icon.chat}
                    </button>
                </div>
            </div>

            {/* Live customization */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <span>Try a different widget color:</span>
                <div className="flex gap-2" role="radiogroup" aria-label="Widget color">
                    {SWATCHES.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            role="radio"
                            aria-checked={color === s.value}
                            aria-label={s.name}
                            title={s.name}
                            onClick={() => setColor(s.value)}
                            style={{ backgroundColor: s.value }}
                            className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition ${color === s.value ? "ring-2 ring-foreground" : "hover:scale-110"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}