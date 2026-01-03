
export interface User {
    id: string; // uuid
    login_id: string;
    email: string;
    role: 'ADMIN' | 'HR' | 'EMPLOYEE';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: string; // uuid
    user_id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    designation?: string;
    department?: string;
    date_of_joining: string;
    profile_image?: string;
    created_at: string;
    updated_at: string;
    // Joined fields
    user?: User;
}

export interface Salary {
    id: string;
    employee_id: string;
    wage_type: 'FIXED' | 'HOURLY';
    base_wage: number;
    working_days?: number;
    monthly_ctc?: number;
    yearly_ctc?: number;
}
