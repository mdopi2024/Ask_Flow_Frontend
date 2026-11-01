"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type ChangeRoleModalProps = {
    userId: string;
    name: string;
    email: string;
    currentRole: string;
    onClose: () => void;
};

const ROLE_OPTIONS = [
    { value: "USER", label: "User", desc: "Standard access to the platform." },
    { value: "ADMIN", label: "Admin", desc: "Full access, can manage users." },
];

export default function ChangeRoleModal({
    userId,
    name,
    email,
    currentRole,
    onClose,
}: ChangeRoleModalProps) {
    const [selected, setSelected] = useState<string>(currentRole);

    // Esc চাপলে modal বন্ধ
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleSave = () => {
        // TODO: এখানে role update function যোগ হবে
        console.log("Update role:", userId, selected);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="role-modal-title"
                className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl"
                onClick={(e) => e.stopPropagation()}
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

                <div className="space-y-2 p-5">
                    {ROLE_OPTIONS.map((o) => {
                        const active = selected === o.value;
                        return (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => setSelected(o.value)}
                                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${active
                                        ? "border-primary bg-primary-soft"
                                        : "border-border hover:bg-muted"
                                    }`}
                            >
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {o.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{o.desc}</p>
                                </div>
                                {active && <Check className="size-4 text-primary" />}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-2 border-t border-border p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={selected === currentRole}
                        className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}