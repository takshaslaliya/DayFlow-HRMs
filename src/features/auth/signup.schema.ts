import { z } from 'zod';

export const signupSchema = z.object({
    loginId: z.string()
        .min(3, 'Login ID must be at least 3 characters')
        .max(20, 'Login ID must be at most 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Login ID can only contain letters, numbers, and underscores'),
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;
