// ---------- Enums ----------
export const FormStatus = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    UNPUBLISHED: "UNPUBLISHED",
} as const;

export type FormStatus = (typeof FormStatus)[keyof typeof FormStatus];

export type FormSort = "newest" | "oldest";

export type WidgetSettings = Record<string, unknown>;


export interface CreateFormPayload {
    title: string;
    description?: string | null;
    widgetSettings?: WidgetSettings;
}


export type UpdateFormPayload = Partial<{
    title: string;
    description: string | null;
    status: typeof FormStatus.PUBLISHED | typeof FormStatus.UNPUBLISHED;
}>;

export type GetAllFormsParams = {
    page?: number;
    limit?: number;
    status?: FormStatus;
    search?: string;
    sort?: FormSort;
};

export interface FormOwner {
    id: string;
    name: string;
    email: string;
}

export interface FormCount {
    questions: number;
    responses: number;
}

export interface Form {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    status: FormStatus;
    publishedAt: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    owner?: FormOwner;
    _count?: FormCount;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface FormStats {
    totalForms: number;
    publishedForms: number;
    draftForms: number;
    unpublishedForms: number;
    totalResponses: number;
}

export interface FormListData {
    items: Form[];
    meta: PaginationMeta;
    stats: FormStats;
}

export interface ApiResult<T> {
    success: boolean;
    message: string;
    data: T;
}

export type FormListResponse = ApiResult<FormListData>;
export type FormResponse = ApiResult<Form>;