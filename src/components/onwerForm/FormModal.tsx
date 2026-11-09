"use client";


import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { deleteForm, getFormById, updateForm } from "@/actions/forms/forms.acton";
import type { FormRow, FormStatusValue, ModalState } from "@/types/forms.ui-types"

function FieldError({ errors }: { errors: unknown[] }) {
    const first = errors
        .map((err) => (typeof err === "string" ? err : (err as { message?: string } | null)?.message))
        .find(Boolean);

    return first ? (
        <p role="alert" className="text-xs text-danger">
            {first}
        </p>
    ) : null;
}

const selectClass = "h-9 w-full rounded-md border border-input bg-surface px-3 text-sm";
const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary-hover";


export function FormModals({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
    return (
        <Dialog open={!!modal} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                {modal?.type === "edit" && <EditForm form={modal.form} onClose={onClose} />}
                {modal?.type === "delete" && <DeleteForm form={modal.form} onClose={onClose} />}
                {modal?.type === "questions" && <QuestionsList form={modal.form} />}
                {modal?.type === "responses" && <ResponsesList form={modal.form} />}
                {modal?.type === "addQuestion" && <AddQuestion form={modal.form} onClose={onClose} />}
            </DialogContent>
        </Dialog>
    );
}


function EditForm({ form: row, onClose }: { form: FormRow; onClose: () => void }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            title: row.title,
            description: row.description ?? "",
            status: row.status as FormStatusValue,
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                await updateForm(row.id, {
                    title: value.title.trim(),
                    description: value.description.trim() || undefined,
                    status: value.status,
                } as any);
                router.refresh();
                onClose();
            } catch (err: any) {
                setServerError(err?.message ?? "Could not update the form.");
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <DialogHeader>
                <DialogTitle>Update form</DialogTitle>
                <DialogDescription>Change the details people see when they open this form.</DialogDescription>
            </DialogHeader>

            <form.Field
                name="title"
                validators={{
                    onChange: ({ value }) =>
                        !value.trim()
                            ? "Enter a title"
                            : value.length > 120
                                ? "Keep the title under 120 characters"
                                : undefined,
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Title</Label>
                        <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            <form.Field
                name="description"
                validators={{
                    onChange: ({ value }) => (value.length > 500 ? "Keep the description under 500 characters" : undefined),
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Description</Label>
                        <Textarea
                            id={field.name}
                            rows={3}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            <form.Field name="status">
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Status</Label>
                        <select
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as FormStatusValue)}
                            className={selectClass}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="UNPUBLISHED">Unpublished</option>
                        </select>
                    </div>
                )}
            </form.Field>

            {serverError && (
                <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{serverError}</p>
            )}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting, s.isDefaultValue] as const}>
                    {([canSubmit, isSubmitting, isDefault]) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting || isDefault} className={primaryBtn}>
                            {isSubmitting && <Loader2 className="size-4 animate-spin" />} Save changes
                        </Button>
                    )}
                </form.Subscribe>
            </DialogFooter>
        </form>
    );
}



function DeleteForm({ form, onClose }: { form: FormRow; onClose: () => void }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const confirm = () =>
        start(async () => {
            try {
                await deleteForm(form.id);
                router.refresh();
                onClose();
            } catch (err: any) {
                setError(err?.message ?? "Could not delete the form.");
            }
        });

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle>Delete this form?</DialogTitle>
                <DialogDescription>
                    “{form.title}” and its {form._count.questions} questions and {form._count.responses} responses will be
                    permanently removed. This can’t be undone.
                </DialogDescription>
            </DialogHeader>

            {error && <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{error}</p>}

            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={confirm} disabled={pending} className="bg-danger text-white hover:bg-danger/90">
                    {pending && <Loader2 className="size-4 animate-spin" />} Delete form
                </Button>
            </DialogFooter>
        </div>
    );
}



function QuestionsList({ form }: { form: FormRow }) {
    const [questions, setQuestions] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        getFormById(form.id)
            .then((res: any) => {
                if (alive) setQuestions((res?.data ?? res)?.questions ?? []);
            })
            .catch((err: unknown) => {
                if (alive) setError(err instanceof Error ? err.message : "Could not load questions.");
            });
        return () => {
            alive = false;
        };
    }, [form.id]);

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle>Questions</DialogTitle>
                <DialogDescription>{form.title}</DialogDescription>
            </DialogHeader>

            {error && <p className="text-sm text-danger">{error}</p>}
            {!questions && !error && <div className="h-24 animate-pulse rounded-lg bg-muted" />}

            <ol className="max-h-[50vh] space-y-2 overflow-y-auto">
                {questions?.map((q, i) => (
                    <li key={q.id} className="flex gap-3 rounded-lg border border-border bg-surface p-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-medium text-primary">
                            {i + 1}
                        </span>
                        <div className="min-w-0">
                            {/* adjust the field names below to match your Question model */}
                            <p className="text-sm font-medium text-foreground">{q.question ?? q.label ?? q.title ?? q.text}</p>
                            {q.type && <p className="text-xs capitalize text-muted-foreground">{String(q.type).toLowerCase()}</p>}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}



function ResponsesList({ form }: { form: FormRow }) {
    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle>Responses</DialogTitle>
                <DialogDescription>{form.title}</DialogDescription>
            </DialogHeader>
            <p className="rounded-lg bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
                {form._count.responses === 0
                    ? "No responses yet. Share the form link to start collecting them."
                    : `${form._count.responses} responses collected.`}
            </p>
        </div>
    );
}



function AddQuestion({ form: row, onClose }: { form: FormRow; onClose: () => void }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: { label: "", type: "TEXT" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                console.log("add question", row.id, value);
                router.refresh();
                onClose();
            } catch (err: any) {
                setServerError(err?.message ?? "Could not add the question.");
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <DialogHeader>
                <DialogTitle>Add your first question</DialogTitle>
                <DialogDescription>“{row.title}” needs at least one question before you can publish it.</DialogDescription>
            </DialogHeader>

            <form.Field
                name="label"
                validators={{ onChange: ({ value }) => (!value.trim() ? "Enter the question" : undefined) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Question</Label>
                        <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="What is your name?"
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            <form.Field name="type">
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Answer type</Label>
                        <select
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={selectClass}
                        >
                            <option value="TEXT">Short text</option>
                            <option value="TEXTAREA">Long text</option>
                            <option value="NUMBER">Number</option>
                        </select>
                    </div>
                )}
            </form.Field>

            {serverError && (
                <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{serverError}</p>
            )}

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                    {([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting} className={primaryBtn}>
                            {isSubmitting && <Loader2 className="size-4 animate-spin" />} Add question
                        </Button>
                    )}
                </form.Subscribe>
            </DialogFooter>
        </form>
    );
}