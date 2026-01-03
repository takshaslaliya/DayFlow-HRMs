
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

export interface LeaveRequest {
    id: string; // uuid
    employee_id: string;
    leave_type: 'PAID' | 'SICK' | 'UNPAID' | 'PERSONAL'; // Adjusted to match potential UI options
    start_date: string;
    end_date: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    applied_at: string;
    // Joined fields
    employee?: Employee;
}

export interface AttendanceRecord {
    id: string; // uuid
    employee_id: string;
    date: string; // YYYY-MM-DD
    check_in: string; // HH:mm:ss
    check_out?: string; // HH:mm:ss
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
    work_hours?: number;
    created_at: string;
    updated_at: string;
    // Joined fields
    employee?: Employee;
}
