import { z } from 'zod';

export const salarySchema = z.object({
    employee_id: z.string().uuid(),
    wage_type: z.enum(['FIXED', 'HOURLY']),
    base_wage: z.number().positive(),
    working_days: z.number().int().min(1),
    monthly_ctc: z.number().min(0).optional(),
    yearly_ctc: z.number().min(0).optional(),
});

export const salaryComponentSchema = z.object({
    salary_id: z.string().uuid(),
    component_name: z.enum([
        'BASIC',
        'HRA',
        'BONUS',
        'STANDARD_ALLOWANCE',
        'TRAVEL_ALLOWANCE',
        'PROVIDENT_FUND',
        'PROFESSIONAL_TAX',
    ]),
    calculation_type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z.number().min(0),
    computed_amount: z.number().optional(),
});
