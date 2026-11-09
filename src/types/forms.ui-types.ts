// components/forms/forms.ui-types.ts
export type FormStatusValue = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export type FormRow = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: FormStatusValue;
    createdAt: string;
    owner?: { id: string; name: string | null; email: string };
    _count: { questions: number; responses: number };
};

export type MyFormsResponse = {
    items: FormRow[];
    meta: { page: number; limit: number; total: number; totalPages: number };
    stats: {
        totalForms: number;
        publishedForms: number;
        draftForms: number;
        unpublishedForms: number;
        totalResponses: number;
    };
};

export type ModalState =
    | { type: "edit" | "delete" | "questions" | "responses" | "addQuestion"; form: FormRow }
    | null;