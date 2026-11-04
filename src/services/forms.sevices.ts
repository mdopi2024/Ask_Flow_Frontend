import "server-only";
import { ApiResponse } from "@/types/auth.types";
import {
    CreateFormPayload,
    UpdateFormPayload,
    GetAllFormsParams,
    FormListResponse,
    FormResponse,
    FormStatus,
} from "@/types/forms.types";
import { cachedGet } from "@/lib/cache/cached.request";
import { CACHE_TAGS } from "@/lib/cache/cachTag";
import { cookie } from "@/utils/catchCookie";
import { api } from "@/lib/api";

const cleanParams = (params: GetAllFormsParams = {}): GetAllFormsParams => {
    const search = params.search?.trim();
    const status = params.status?.trim().toUpperCase() as FormStatus | undefined;

    return {
        ...(params.page && { page: params.page }),
        ...(params.limit && { limit: params.limit }),
        ...(params.sort && { sort: params.sort }),
        ...(status && { status }),
        ...(search && { search }),
    };
};

const formService = {
    getPublicForm: (slug: string) =>
        cachedGet<FormResponse>({
            url: `/forms/public/${slug}`,
            tags: [CACHE_TAGS.publicForm(slug)],
        }),
    getAllForms: (params: GetAllFormsParams = {}) =>
        cachedGet<FormListResponse>({
            url: "/forms",
            params: cleanParams(params),
            tags: [CACHE_TAGS.forms],
        }),
    getFormsByOwnerId: (params: GetAllFormsParams = {}) =>
        cachedGet<FormListResponse>({
            url: "/forms/my",
            params: cleanParams(params),
            tags: [CACHE_TAGS.myForms],
        }),
    getFormById: (id: string) =>
        cachedGet<FormResponse>({
            url: `/forms/${id}`,
            tags: [CACHE_TAGS.form(id)],
        }),
    createForm: async (payload: CreateFormPayload) => {
        const cookieHeader = await cookie();

        const { data } = await api.post<FormResponse>(
            "/forms",
            payload,
            { headers: { Cookie: cookieHeader } }
        );

        return data;
    },
    updateForm: async (id: string, payload: UpdateFormPayload) => {
        const cookieHeader = await cookie();

        const { data } = await api.patch<FormResponse>(
            `/forms/${id}`,
            payload,
            { headers: { Cookie: cookieHeader } }
        );

        return data;
    },
    deleteForm: async (id: string) => {
        const cookieHeader = await cookie();

        const { data } = await api.delete<ApiResponse>(
            `/forms/${id}`,
            { headers: { Cookie: cookieHeader } }
        );

        return data;
    },
};

export default formService;