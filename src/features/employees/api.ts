
import { supabase } from '@/lib/supabase';


// Fetch all employees with their associated user details
export const getEmployees = async () => {
    const { data, error } = await supabase
        .from('employees')
        .select(`
            *,
            user:users (
                email,
                is_active
            )
        `);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getEmployeeByUserId = async (userId: string) => {
    const { data, error } = await supabase
        .from('employees')
        .select(`
            *,
            user:users (
                email,
                is_active
            ),
            salaries (
                id,
                base_wage,
                monthly_ctc,
                yearly_ctc,
                wage_type,
                working_days
            )
        `)
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Create a new employee (and user)
export const createEmployee = async (employeeData: Record<string, any>) => {
    const { name, email, position, department, phone, address, salary, date_of_joining } = employeeData;

    // 1. Create User
    // Use the first part of the email as the login_id + random number/string if needed. 
    // Here we use email as logic_id for simplicity or derive it.
    // NOTE: Password handling is simplified. In a real app, use a proper Auth Signup or Edge Function.
    // For this dashboard, we insert directly into public.users? OR use auth.signUp if using Supabase Auth.
    // Based on schema, we have public.users table.

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || 'User';

    const loginId = email.split('@')[0] + Math.floor(Math.random() * 1000);

    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
            login_id: loginId,
            email: email,
            password_hash: 'defaultParams123!', // Placeholder
            role: 'EMPLOYEE',
            is_active: true
        })
        .select()
        .single();

    if (userError) throw new Error(`User creation failed: ${userError.message}`);

    // 2. Create Employee
    const { data: employee, error: empError } = await supabase
        .from('employees')
        .insert({
            user_id: userData.id,
            first_name: firstName,
            last_name: lastName,
            designation: position,
            department: department,
            phone: phone,
            address: address,
            date_of_joining: date_of_joining, // Ensure format YYYY-MM-DD
            profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        })
        .select()
        .single();

    if (empError) {
        // Rollback user creation? (Not easily possible without transactions/functions)
        // For now, just throw.
        throw new Error(`Employee profile creation failed: ${empError.message}`);
    }

    // 3. Create Salary Record (Optional but good for completeness)
    if (salary) {
        await supabase.from('salaries').insert({
            employee_id: employee.id,
            wage_type: 'FIXED',
            base_wage: parseFloat(salary),
            monthly_ctc: parseFloat(salary), // Simplified
            yearly_ctc: parseFloat(salary) * 12
        });
    }

    return employee;
};

// Update an employee
export const updateEmployee = async (employeeId: string, employeeData: any) => {
    const { name, email, position, department, phone, address, salary, date_of_joining } = employeeData;

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    // 1. Update Employee Details
    const { data: employee, error: empError } = await supabase
        .from('employees')
        .update({
            first_name: firstName,
            last_name: lastName,
            designation: position,
            department: department,
            phone: phone,
            address: address,
            date_of_joining: date_of_joining,
            // optional: update profile image if name changes? 
            // profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        })
        .eq('id', employeeId)
        .select()
        .single();

    if (empError) {
        throw new Error(`Failed to update employee: ${empError.message}`);
    }

    // 2. Update Salary (if provided) - Simplified logic: update if exists, insert if not? 
    // For now assuming 1:1 relationship and just upserting or ignoring if complex.
    // Let's stick to updating the salary record if it exists for this employee.
    if (salary) {
        // Check if salary record exists
        const { data: salaryData } = await supabase
            .from('salaries')
            .select('id')
            .eq('employee_id', employeeId)
            .single();

        if (salaryData) {
            await supabase.from('salaries').update({
                base_wage: parseFloat(salary),
                monthly_ctc: parseFloat(salary),
                yearly_ctc: parseFloat(salary) * 12
            }).eq('employee_id', employeeId);
        } else {
            await supabase.from('salaries').insert({
                employee_id: employeeId,
                wage_type: 'FIXED',
                base_wage: parseFloat(salary),
                monthly_ctc: parseFloat(salary),
                yearly_ctc: parseFloat(salary) * 12
            });
        }
    }

    // 3. Update User Email (Optional)
    // Changing email is sensitive as it changes login ID too in our logic. 
    // For now, let's assume specific user update is separate or ignored here.

    return employee;
};

// Delete an employee and their associated user account
export const deleteEmployee = async (employeeId: string, userId?: string) => {
    // 1. Delete Employee
    const { error: empError } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

    if (empError) {
        throw new Error(`Failed to delete employee: ${empError.message}`);
    }

    // 2. Delete User (if userId is provided)
    if (userId) {
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (userError) {
            console.error('Failed to delete user account:', userError);
            // We don't throw here to avoid "failure" if employee was already deleted
            // but user deletion failed (orphaned user is less critical than blocking UI)
        }
    }
};
