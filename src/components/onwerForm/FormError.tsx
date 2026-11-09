
export function FieldError({ errors }: { errors: unknown[] }) {
    const messages = errors
        .map((e) => (typeof e === "string" ? e : (e as { message?: string })?.message))
        .filter(Boolean);

    if (messages.length === 0) return null;

    return (
        <p role="alert" className="text-xs text-danger">
            {messages[0]}
        </p>
    );
}