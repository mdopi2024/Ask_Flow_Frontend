"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Base modal (native <dialog>: focus trap, Esc to close, backdrop)    */
/* ------------------------------------------------------------------ */

type ModalProps = {
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export function Modal({ title, description, onClose, children, footer }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    return (
        <dialog
            ref={ref}
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={(e) => e.target === ref.current && ref.current?.close()} // click on backdrop
            className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-foreground/40 open:animate-in open:fade-in-0 open:zoom-in-95"
        >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="min-w-0">
                    <h2 id={titleId} className="truncate text-base font-semibold">{title}</h2>
                    {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
                </div>
                <button
                    type="button"
                    onClick={() => ref.current?.close()}
                    aria-label="Close"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <X className="size-4" aria-hidden />
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">{children}</div>

            {footer && (
                <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
                    {footer}
                </div>
            )}
        </dialog>
    );
}

export const modalBtn =
    "inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium transition-colors";
const btnGhost = cn(modalBtn, "border border-input bg-card hover:bg-muted");
const btnPrimary = cn(modalBtn, "bg-primary text-primary-foreground hover:bg-primary-hover");

/* ------------------------------------------------------------------ */
/* Hard-coded sample loaders. TODO: replace with real server actions.  */
/* ------------------------------------------------------------------ */

type QuestionItem = { id: string; text: string; type: string; required: boolean };
type ResponseItem = { id: string; respondent: string; submittedAt: string; preview: string };

async function loadQuestions(_formId: string, count: number): Promise<QuestionItem[]> {
    // TODO: e.g. return (await getFormQuestions(_formId)).data
    await new Promise((r) => setTimeout(r, 300));
    const sample: Omit<QuestionItem, "id">[] = [
        { text: "What is your name?", type: "Short text", required: true },
        { text: "How satisfied are you with the product?", type: "Rating", required: true },
        { text: "Which features do you use most?", type: "Multiple choice", required: false },
        { text: "Would you recommend us to a friend?", type: "Yes / No", required: false },
        { text: "Any other feedback?", type: "Long text", required: false },
    ];
    return sample.slice(0, Math.min(count, sample.length)).map((q, i) => ({ ...q, id: `q${i}` }));
}

async function loadResponses(_formId: string, count: number): Promise<ResponseItem[]> {
    // TODO: e.g. return (await getFormResponses(_formId)).data
    await new Promise((r) => setTimeout(r, 300));
    const day = 86_400_000;
    const sample = [
        { respondent: "Anonymous", preview: "Satisfied: 5/5 · Uses reports most" },
        { respondent: "sara@example.com", preview: "Satisfied: 4/5 · Would recommend" },
        { respondent: "Anonymous", preview: "Satisfied: 3/5 · Wants dark mode" },
        { respondent: "john@example.com", preview: "Satisfied: 5/5 · No other feedback" },
        { respondent: "Anonymous", preview: "Satisfied: 2/5 · Export is slow" },
    ];
    return sample.slice(0, Math.min(count, sample.length)).map((r, i) => ({
        ...r,
        id: `r${i}`,
        submittedAt: new Date(Date.now() - i * day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));
}

function useLoad<T>(load: () => Promise<T[]>) {
    const [items, setItems] = useState<T[] | null>(null);
    useEffect(() => {
        let cancelled = false;
        load().then((d) => !cancelled && setItems(d));
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return items;
}

function ListState({ loading, empty, message }: { loading: boolean; empty: boolean; message: string }) {
    if (loading)
        return (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden /> Loading…
            </p>
        );
    if (empty) return <p className="py-10 text-center text-sm text-muted-foreground">{message}</p>;
    return null;
}

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

type ViewProps = { formId: string; formTitle: string; count: number; onClose: () => void };

export function QuestionsModal({ formId, formTitle, count, onClose }: ViewProps) {
    const items = useLoad(() => loadQuestions(formId, count));

    return (
        <Modal
            title="Questions"
            description={`${formTitle} · ${count} total`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className={btnPrimary} onClick={onClose}>Done</button>
                </>
            }
        >
            <ListState loading={items === null} empty={items?.length === 0} message="This form has no questions yet." />
            {items && items.length > 0 && (
                <ol className="divide-y divide-border">
                    {items.map((q, i) => (
                        <li key={q.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                            <span className="mt-0.5 w-5 shrink-0 text-sm tabular-nums text-muted-foreground">{i + 1}.</span>
                            <div className="min-w-0">
                                <p className="text-sm font-medium">{q.text}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {q.type}{q.required ? " · Required" : ""}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </Modal>
    );
}

/* ------------------------------------------------------------------ */
/* Responses                                                           */
/* ------------------------------------------------------------------ */

export function ResponsesModal({ formId, formTitle, count, onClose }: ViewProps) {
    const items = useLoad(() => loadResponses(formId, count));

    return (
        <Modal
            title="Responses"
            description={`${formTitle} · ${count} total`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className={btnPrimary} onClick={onClose}>Done</button>
                </>
            }
        >
            <ListState loading={items === null} empty={items?.length === 0} message="No one has responded yet." />
            {items && items.length > 0 && (
                <ul className="divide-y divide-border">
                    {items.map((r) => (
                        <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-sm font-medium">{r.respondent}</p>
                                <p className="shrink-0 text-xs text-muted-foreground">{r.submittedAt}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{r.preview}</p>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
}

/* ------------------------------------------------------------------ */
/* Delete confirmation                                                 */
/* ------------------------------------------------------------------ */

type DeleteProps = {
    formTitle: string;
    questionsCount: number;
    responsesCount: number;
    onConfirm: () => void;
    onClose: () => void;
};

export function DeleteFormModal({ formTitle, questionsCount, responsesCount, onConfirm, onClose }: DeleteProps) {
    return (
        <Modal
            title="Delete form"
            onClose={onClose}
            footer={
                <>
                    <button type="button" autoFocus className={btnGhost} onClick={onClose}>Cancel</button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); onClose(); }}
                        className={cn(modalBtn, "bg-danger text-white hover:bg-danger/90 dark:text-slate-950")}
                    >
                        Delete form
                    </button>
                </>
            }
        >
            <div className="flex gap-3 rounded-lg border border-danger/30 bg-danger-soft p-4 text-danger-foreground">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div className="space-y-1 text-sm">
                    <p className="font-medium">This can’t be undone.</p>
                    <p>
                        Deleting <span className="font-semibold">{formTitle}</span> also removes its{" "}
                        {questionsCount} {questionsCount === 1 ? "question" : "questions"} and{" "}
                        {responsesCount} {responsesCount === 1 ? "response" : "responses"}.
                    </p>
                </div>
            </div>
        </Modal>
    );
}