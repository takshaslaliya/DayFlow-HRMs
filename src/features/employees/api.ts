
import { supabase } from '@/lib/supabase';


// Fetch all employees with their associated user details
export const getEmployees = async () => {
    const { data, error } = await supabase
        .from('employees')
        .select(`
            *,
            user:users (
                email,
                login_id,
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

// Helper: Generate Login ID
const generateLoginId = async (firstName: string, lastName: string, dateOfJoining: string) => {
    // 1. Prefix (Default to 'DF' for DayFlow)
    const prefix = 'DF';

    // 2. Name Part (First 2 chars of First + Last, uppercase)
    const namePart = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();

    // 3. Year Part
    const year = new Date(dateOfJoining).getFullYear().toString();

    // 4. Serial Number (Count employees joined in that year + 1)
    // We need to query employees by joining year.
    // Filter by date_of_joining range for that year
    const startOfYear = `${year}-01-01`;
    const endOfYear = `${year}-12-31`;

    const { count, error } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .gte('date_of_joining', startOfYear)
        .lte('date_of_joining', endOfYear);

    if (error) {
        console.error('Error counting employees:', error);
        throw new Error('Failed to generate Login ID');
    }

    const serial = (count || 0) + 1;
    const serialPart = serial.toString().padStart(4, '0');

    return `${prefix}${namePart}${year}${serialPart}`;
};

// Helper: Generate Password
const generatePassword = (firstName: string) => {
    // Format: Name(NIT) -> interpreted as Name@123 or Name@2024 for now, or literally Name(NIT)
    // Using a standard format based on the request style, but "NIT" likely meant an institution or company suffix.
    // Let's use: Firstname@123
    return `${firstName}@123`;
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

    // Generate custom Login ID and Password
    const loginId = await generateLoginId(firstName, lastName, date_of_joining);
    const generatedPassword = generatePassword(firstName);

    // Hash the password using bcrypt
    const { hashPassword } = await import('@/lib/password.utils');
    const passwordHash = await hashPassword(generatedPassword);

    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
            login_id: loginId,
            email: email, // Email is stored but Login ID is primary identifier for this flow
            password_hash: passwordHash,
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

    return {
        ...employee,
        user: userData,
        // Include generated credentials for admin to display to new employee
        generatedCredentials: {
            loginId,
            password: generatedPassword
        }
    };
};

// Update an employee
export const updateEmployee = async (employeeId: string, employeeData: any) => {
    const { name, position, department, phone, address, salary, date_of_joining } = employeeData;

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
