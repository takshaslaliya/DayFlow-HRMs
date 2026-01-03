import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

interface RoleProtectedRouteProps {
    allowedRoles: string[];
}

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user.role?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
        // Redirect unauthorized users to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
