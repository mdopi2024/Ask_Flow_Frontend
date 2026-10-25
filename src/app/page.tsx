"use client";

import { useEffect, useRef, useState } from "react";

type Question = {
  id: string;
  type: "text" | "email" | "choice" | "yesno";
  label: string;
  required: boolean;
  options?: string[];
};
type Msg = { from: "bot" | "user"; text: string };

const WELCOME = "Hi there! 👋 Mind answering a few quick questions?";
const DONE = "Thanks! Your response has been recorded.";

const QUESTIONS: Question[] = [
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

function validate(q: Question, raw: string): string | null {
  const v = raw.trim();
  if (!v) return q.required ? "This question is required." : null;
  if (v.length > 1000) return "Answer is too long.";
  if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return "Please enter a valid email.";
  }
  return null;
}

function initialMessages(): Msg[] {
  return [
    { from: "bot", text: WELCOME },
    { from: "bot", text: QUESTIONS[0].label },
  ];
}

export default function DemoChat() {
  const [step, setStep] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll only the chat list, so the page itself doesn't jump.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const q = QUESTIONS[step];

  function submit(value: string) {
    if (done || !q) return;
    const err = validate(q, value);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setInput("");
    const reply: Msg = { from: "user", text: value.trim() || "(skipped)" };
    if (step + 1 < QUESTIONS.length) {
      setMsgs((m) => [...m, reply, { from: "bot", text: QUESTIONS[step + 1].label }]);
      setStep(step + 1);
    } else {
      setMsgs((m) => [...m, reply, { from: "bot", text: DONE }]);
      setDone(true);
    }
  }

  function restart() {
    setStep(0);
    setMsgs(initialMessages());
    setInput("");
    setError("");
    setDone(false);
  }

  const buttons =
    q?.type === "yesno" ? ["Yes", "No"] : q?.type === "choice" ? q.options ?? [] : null;

  return (
    <div className="mx-auto flex h-[480px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <span className="font-semibold">Assistant</span>
        <button
          onClick={restart}
          className="rounded px-2 py-1 text-xs font-medium hover:bg-white/15"
        >
          Start over
        </button>
      </div>

      <div
        ref={listRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.from === "user"
                ? "max-w-[80%] self-end rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "max-w-[80%] self-start rounded-2xl border border-border bg-surface px-3 py-2 text-sm"
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      {!done && q && (
        <div className="border-t border-border bg-surface p-3">
          {error && (
            <p role="alert" className="mb-2 text-xs text-danger">
              {error}
            </p>
          )}
          {buttons ? (
            <div className="flex flex-wrap gap-2">
              {buttons.map((b) => (
                <button
                  key={b}
                  onClick={() => submit(b)}
                  className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                >
                  {b}
                </button>
              ))}
              {!q.required && (
                <button
                  onClick={() => submit("")}
                  className="rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:bg-background"
                >
                  Skip
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit(input)}
                type={q.type === "email" ? "email" : "text"}
                placeholder="Type your answer…"
                aria-label="Your answer"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => submit(input)}
                className="rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="border-t border-border bg-surface p-3 text-center">
          <button onClick={restart} className="text-sm font-medium text-primary hover:underline">
            Try it again
          </button>
        </div>
      )}
    </div>
  );
}