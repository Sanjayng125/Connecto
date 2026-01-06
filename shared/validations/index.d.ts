import { z } from 'zod';

export const signupSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}>;

export const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}>;

export const updateProfileSchema: z.ZodObject<{
    username: z.ZodString;
}>;

export const respondToContactRequestSchema: z.ZodObject<{
    action: z.ZodEnum<["accepted", "blocked"]>;
}>;

export const updateContactSchema: z.ZodObject<{
    nickname: z.ZodString;
    isFavorite?: z.ZodBoolean;
}>;

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RespondToContactRequestInput = z.infer<typeof respondToContactRequestSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;