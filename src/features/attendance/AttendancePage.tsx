import { useAuth } from '@/features/auth/hooks/useAuth';
import { EmployeeAttendance } from './EmployeeAttendance';
import { AdminAttendance } from '@/features/admin/AdminAttendance';

export const AttendancePage = () => {
    const { user } = useAuth();
    const role = (user as any)?.role || 'employee';

    if (role === 'admin') {
        return <AdminAttendance />;
    }

    return <EmployeeAttendance />;
};
