import { z } from 'zod';

export const loginSchema = z.object({
    loginId: z.string().min(1, 'Login ID or Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;
