import { z } from 'zod';

export const employeeSchema = z.object({
    name: z.string(),
    position: z.string(),
});
