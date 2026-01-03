export type WageType = 'FIXED' | 'HOURLY';

export interface Salary {
    id: string;
    employee_id: string;
    wage_type: WageType;
    base_wage: number;
    working_days: number;
    monthly_ctc?: number;
    yearly_ctc?: number;
    created_at?: string;
    updated_at?: string;
}

export type ComponentName =
    | 'BASIC'
    | 'HRA'
    | 'BONUS'
    | 'STANDARD_ALLOWANCE'
    | 'TRAVEL_ALLOWANCE'
    | 'PROVIDENT_FUND'
    | 'PROFESSIONAL_TAX';

export type CalculationType = 'PERCENTAGE' | 'FIXED';

export interface SalaryComponent {
    id: string;
    salary_id: string;
    component_name: ComponentName;
    calculation_type: CalculationType;
    value: number;
    computed_amount?: number;
    created_at?: string;
}
