import { supabase } from '@/lib/supabase';
import type { AttendanceRecord, Employee } from '@/types';
import { format, differenceInMinutes, parse, isAfter, set } from 'date-fns';

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

// Fetch today's attendance for the current user
export const getTodayAttendance = async (userId: string) => {
    const employee = await getCurrentEmployeeProfile(userId);
    if (!employee) return null;

    const today = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('date', today)
        .maybeSingle(); // Use maybeSingle to avoid error if no record exists

    if (error) throw new Error(error.message);
    return data as AttendanceRecord | null;
};

// Check In
export const checkIn = async (userId: string) => {
    const employee = await getCurrentEmployeeProfile(userId);
    if (!employee) throw new Error('Employee profile not found');

    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm:ss');

    // Simple logic to determine status based on time (e.g., late after 9:30 AM)
    // This could be configurable per organization
    const workStartTime = set(now, { hours: 9, minutes: 30, seconds: 0 });
    const status = isAfter(now, workStartTime) ? 'LATE' : 'PRESENT';

    const { data, error } = await supabase
        .from('attendance')
        .insert({
            employee_id: employee.id,
            date: today,
            check_in: time,
            status: status
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as AttendanceRecord;
};

// Check Out
export const checkOut = async (attendanceId: string) => {
    const now = new Date();
    const time = format(now, 'HH:mm:ss');

    // Fetch the check-in time to calculate work hours
    const { data: record, error: fetchError } = await supabase
        .from('attendance')
        .select('check_in')
        .eq('id', attendanceId)
        .single();

    if (fetchError) throw new Error(fetchError.message);

    const checkInTime = parse(record.check_in, 'HH:mm:ss', new Date());
    const minutesWorked = differenceInMinutes(now, checkInTime);
    const hoursWorked = Number((minutesWorked / 60).toFixed(2));

    const { data, error } = await supabase
        .from('attendance')
        .update({
            check_out: time,
            work_hours: hoursWorked
        })
        .eq('id', attendanceId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data as AttendanceRecord;
};

// Fetch history for specific employee
export const getMyAttendance = async (userId: string) => {
    const employee = await getCurrentEmployeeProfile(userId);
    if (!employee) return [];

    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employee.id)
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data as AttendanceRecord[];
};

// Fetch all attendance (for admin)
export const getAllAttendance = async () => {
    const { data, error } = await supabase
        .from('attendance')
        .select(`
            *,
            employee:employees (
                first_name,
                last_name,
                profile_image,
                department,
                designation
            )
        `)
        .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data as AttendanceRecord[];
};
