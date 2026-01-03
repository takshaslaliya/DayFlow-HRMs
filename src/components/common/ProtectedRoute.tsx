import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export function ProtectedRoute() {
    const user = useAuthStore((state) => state.user);

    // For now, if user is null, redirect. Ideally, check loading state too.
    // Since we have no real login yet, this might cause loop if initial state is null.
    // BUT the user asked for logout to work.
    // The store starts with user: null line 10.
    // So adding this now will lock everyone out unless we simulate login or check for "fake-token".
    // Let's assume for this task "logged in" means user object exists.
    // I will update the auth store to have a default fake user for dev purposes, 
    // or I assume the user will login via the Login page (which is a placeholder).

    // Actually, to verify this works, I should probably seed a fake user on mount if developing,
    // OR just ensure the redirections happen.

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
