"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopySlugButton({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false);

    // Reset the "copied" state after a moment
    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(t);
    }, [copied]);

    async function copy() {
        try {
            await navigator.clipboard.writeText(slug);
            setCopied(true);
        } catch {
            // Clipboard can be blocked (e.g. non-HTTPS); nothing else to do here.
        }
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Slug copied" : `Copy slug ${slug}`}
            title={copied ? "Copied!" : "Copy slug"}
            className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-md transition-colors",
                copied
                    ? "text-success"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        </button>
    );
}