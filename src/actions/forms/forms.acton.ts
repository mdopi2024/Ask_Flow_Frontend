

"use server";

import { CACHE_TAGS } from "@/lib/cache/cachTag";
import formService from "@/services/forms.sevices";

import {
    CreateFormPayload,
    UpdateFormPayload,
    GetAllFormsParams,
} from "@/types/forms.types";
import { updateTag } from "next/cache";

export type CreateFormResult =
    | { ok: true; id?: string }
    | { ok: false; message: string };

export const getPublicForm = async (slug: string) => {
    return await formService.getPublicForm(slug);
};


export const getAllForms = async (params: GetAllFormsParams = {}) => {
    return await formService.getAllForms(params);
};

export const getMyForms = async (params: GetAllFormsParams = {}) => {
    return await formService.getFormsByOwnerId(params);
};

export const getFormById = async (id: string) => {
    return await formService.getFormById(id);
};

export async function createFormAction(
    payload: CreateFormPayload
): Promise<CreateFormResult> {
    try {
        const res: any = await formService.createForm(payload);

        // Make the new form show up in "My forms" right away
        updateTag(CACHE_TAGS.myForms);

        return { ok: true, id: res?.data?.id };
    } catch (error: any) {
        return {
            ok: false,
            message:
                error?.response?.data?.message ??
                error?.message ??
                "Something went wrong while creating the form.",
        };
    }
}

export const updateForm = async (id: string, payload: UpdateFormPayload) => {
    const result = await formService.updateForm(id, payload);

    updateTag(CACHE_TAGS.forms);
    updateTag(CACHE_TAGS.myForms);
    updateTag(CACHE_TAGS.form(id));
    if (result?.data?.slug) {
        updateTag(CACHE_TAGS.publicForm(result.data.slug));
    }

    return result;
};

export const deleteForm = async (id: string) => {
    const result = await formService.deleteForm(id);

    updateTag(CACHE_TAGS.forms);
    updateTag(CACHE_TAGS.myForms);
    updateTag(CACHE_TAGS.form(id));

    return result;
};

export const refreshForms = async () => {
    updateTag(CACHE_TAGS.forms);
    updateTag(CACHE_TAGS.myForms);
};