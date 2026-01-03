import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AppLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar onLogoutClick={handleLogout} />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
