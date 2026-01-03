import { supabase } from '@/lib/supabase';
import type { LeaveRequest, Employee } from '@/types';

// Helper to get current employee profile based on auth user
export const getCurrentEmployeeProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return null;
    return data as Employee;
};

// Fetch leaves for a specific user (employee)
export const getMyLeaves = async (userId: string) => {
    // First get employee_id
    const employee = await getCurrentEmployeeProfile(userId);
    if (!employee) return [];

    const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', employee.id)
        .order('applied_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as LeaveRequest[];
};

// Fetch all leaves (for admin) joined with employee data
export const getAllLeaves = async () => {
    const { data: leaveRequests, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('applied_at', { ascending: false });

    if (error) {
        console.error('Error fetching leaves:', error);
        throw new Error(error.message);
    }

    // Fetch employee details separately for each leave request
    if (leaveRequests && leaveRequests.length > 0) {
        const leavesWithEmployees = await Promise.all(
            leaveRequests.map(async (leave) => {
                const { data: employee } = await supabase
                    .from('employees')
                    .select('first_name, last_name, profile_image, department, designation')
                    .eq('id', leave.employee_id)
                    .single();

                return {
                    ...leave,
                    employee: employee || null
                };
            })
        );
        return leavesWithEmployees;
    }

    return leaveRequests;
};

// Create a new leave request
export const createLeaveRequest = async (userId: string, leaveData: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string
}) => {
    const employee = await getCurrentEmployeeProfile(userId);
    if (!employee) throw new Error('Employee profile not found');

    const { data, error } = await supabase
        .from('leave_requests')
        .insert({
            employee_id: employee.id,
            leave_type: leaveData.type.toUpperCase(),
            start_date: leaveData.startDate,
            end_date: leaveData.endDate,
            reason: leaveData.reason,
            status: 'PENDING'
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// Update leave status (Admin only)
export const updateLeaveStatus = async (id: string, status: 'APPROVED' | 'REJECTED', _comment?: string) => {
    // Note: comment is not in schema yet, ignoring locally or could be stored in a separate table/field if added
    const { data, error } = await supabase
        .from('leave_requests')
        .update({ status: status.toUpperCase() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};
