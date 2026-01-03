import { supabase } from '@/lib/supabase';

export interface DashboardStats {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
    leavesPending: number;
    salaryProcessed: number;
    weeklyStats: { name: string; present: number; absent: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    // Parallelize queries for performance
    const [
        { count: totalEmployees },
        { count: presentToday },
        { count: leavesPending },
        { data: salaries },
        { data: weeklyAttendance }
    ] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('attendance')
            .select('*', { count: 'exact', head: true })
            .eq('attendance_date', todayStr)
            .eq('status', 'PRESENT'),
        supabase.from('leave_requests')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'PENDING'),
        supabase.from('salaries').select('monthly_ctc'),
        supabase.from('attendance')
            .select('attendance_date, status')
            .gte('attendance_date', sevenDaysAgoStr)
            .lte('attendance_date', todayStr)
    ]);

    // Calculate absent today (Total - Present)
    const total = totalEmployees || 0;
    const present = presentToday || 0;
    const absentToday = Math.max(0, total - present);

    // Calculate salary sum
    const salaryProcessed = salaries?.reduce((sum, record) => sum + (Number(record.monthly_ctc) || 0), 0) || 0;

    // Process weekly stats
    const weeklyMap = new Map<string, { present: number; absent: number }>();

    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        weeklyMap.set(dStr, { present: 0, absent: 0 });
    }

    weeklyAttendance?.forEach(record => {
        const date = record.attendance_date;
        if (weeklyMap.has(date)) {
            const stats = weeklyMap.get(date)!;
            if (record.status === 'PRESENT' || record.status === 'HALF_DAY') {
                stats.present += 1;
            } else if (record.status === 'ABSENT') {
                stats.absent += 1;
            }
        }
    });

    // Format for Recharts
    const weeklyStats = Array.from(weeklyMap.entries()).map(([date, stats]) => {
        const defaultAbsent = Math.max(0, total - stats.present); // Fallback if no explicit absent records
        return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            present: stats.present,
            absent: stats.absent > 0 ? stats.absent : defaultAbsent
        };
    });

    return {
        totalEmployees: total,
        presentToday: present,
        absentToday,
        leavesPending: leavesPending || 0,
        salaryProcessed,
        weeklyStats
    };
};
