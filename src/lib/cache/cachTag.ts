export const CACHE_TAGS = {
    users: "users",
    user: (id: string) => `user-${id}`,

    forms: "forms",
    myForms: "my-forms",
    form: (id: string) => `form-${id}`,
    publicForm: (slug: string) => `public-form-${slug}`,
} as const;