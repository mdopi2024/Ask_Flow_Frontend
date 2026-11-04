"use client";

import { useState } from "react";
import { ListChecks, MessageSquareText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteFormModal, QuestionsModal, ResponsesModal } from "@/components/forms/FormModals";

type Props = {
    formId: string;
    title: string;
    questionsCount: number;
    responsesCount: number;
};

type Active = "questions" | "responses" | "delete" | null;

const btn =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground";

export function FormRowActions({ formId, title, questionsCount, responsesCount }: Props) {
    const [active, setActive] = useState<Active>(null);
    const close = () => setActive(null);

    // TODO: replace with the real delete server action
    const deleteForm = () => console.log("[TODO] delete form", formId);

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setActive("questions")} className={btn} aria-label={`View questions for ${title}`}>
                    <ListChecks className="size-3.5" aria-hidden />
                    Questions
                    <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{questionsCount}</span>
                </button>
                <button type="button" onClick={() => setActive("responses")} className={btn} aria-label={`View responses for ${title}`}>
                    <MessageSquareText className="size-3.5" aria-hidden />
                    Responses
                    <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{responsesCount}</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActive("delete")}
                    aria-label={`Delete ${title}`}
                    title="Delete form"
                    className={cn(btn, "w-8 justify-center px-0 text-danger hover:bg-danger-soft hover:text-danger-foreground")}
                >
                    <Trash2 className="size-3.5" aria-hidden />
                </button>
            </div>

            {active === "questions" && (
                <QuestionsModal formId={formId} formTitle={title} count={questionsCount} onClose={close} />
            )}
            {active === "responses" && (
                <ResponsesModal formId={formId} formTitle={title} count={responsesCount} onClose={close} />
            )}
            {active === "delete" && (
                <DeleteFormModal
                    formTitle={title}
                    questionsCount={questionsCount}
                    responsesCount={responsesCount}
                    onConfirm={deleteForm}
                    onClose={close}
                />
            )}
        </>
    );
}