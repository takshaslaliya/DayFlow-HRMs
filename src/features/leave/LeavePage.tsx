import { useAuth } from '@/features/auth/hooks/useAuth';
import { EmployeeLeave } from './EmployeeLeave';
import { AdminLeaves } from '@/features/admin/AdminLeaves';

export const LeavePage = () => {
    const { user } = useAuth();
    const role = (user as any)?.role || 'employee';

    if (role === 'admin') {
        return <AdminLeaves />;
    }

    return <EmployeeLeave />;
};
