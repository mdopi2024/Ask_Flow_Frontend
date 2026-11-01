"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Check, X } from "lucide-react";
import { Role } from "@/types/auth.types";
import { updateUserRole } from "@/actions/user/user.actions";

type ChangeRoleModalProps = {
    userId: string;
    name: string;
    email: string;
    currentRole: string;
    onClose: () => void;
};

const ROLE_OPTIONS: { value: Role; label: string; desc: string }[] = [
    { value: Role.USER, label: "User", desc: "Standard access to the platform." },
    { value: Role.ADMIN, label: "Admin", desc: "Full access, can manage users." },
];

export default function ChangeRoleModal({
    userId,
    name,
    email,
    currentRole,
    onClose,
}: ChangeRoleModalProps) {
    const [error, setError] = useState<string | null>(null);

    // Normalize so "user" / "User" / "USER" all become Role.USER
    const normalizedCurrent = String(currentRole).toUpperCase() as Role;

    const form = useForm({
        defaultValues: {
            role: normalizedCurrent,
        },
        onSubmit: async ({ value }) => {
            setError(null);
            try {
                await updateUserRole(userId, value.role);
                onClose();
            } catch {
                setError("Failed to update role. Please try again.");
            }
        },
    });

    // Close modal on Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="role-modal-title"
                className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className="flex items-start justify-between border-b border-border p-5">
                    <div>
                        <h2
                            id="role-modal-title"
                            className="text-lg font-semibold text-foreground"
                        >
                            Change role
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {name} · {email}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <form.Field name="role">
                    {(field) => (
                        <div className="space-y-2 p-5">
                            {ROLE_OPTIONS.map((o) => {
                                const active = field.state.value === o.value;
                                const isCurrent = o.value === normalizedCurrent;

                                return (
                                    <button
                                        key={o.value}
                                        type="button"
                                        onClick={() => field.handleChange(o.value)}
                                        onBlur={field.handleBlur}
                                        aria-pressed={active}
                                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${active
                                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                                : "border-border hover:bg-muted"
                                            }`}
                                    >
                                        <div>
                                            <p className="flex items-center text-sm font-medium text-foreground">
                                                {o.label}
                                                {isCurrent && (
                                                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                        Current
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {o.desc}
                                            </p>
                                        </div>

                                        {active && (
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="size-3" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                            {error && (
                                <p role="alert" className="pt-1 text-sm text-destructive">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                <div className="flex justify-end gap-2 border-t border-border p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                        Cancel
                    </button>
                    <form.Subscribe
                        selector={(state) => ({
                            role: state.values.role,
                            isSubmitting: state.isSubmitting,
                        })}
                    >
                        {({ role, isSubmitting }) => (
                            <button
                                type="submit"
                                disabled={role === normalizedCurrent || isSubmitting}
                                className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save changes"}
                            </button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </div>
    );
}