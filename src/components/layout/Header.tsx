import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Get display values
    const employee = user?.metadata?.employee;
    const fullName = employee ? `${employee.first_name} ${employee.last_name}` : null;

    const displayName = fullName || user?.metadata?.login_id || user?.email || 'User';
    const displayRole = user?.role?.toUpperCase() || 'GUEST';
    const displayEmail = user?.email || '';

    const initials = employee
        ? `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()
        : displayName.substring(0, 2).toUpperCase();

    // Capitalize first letter
    const Breadcrumb = () => (
        <nav className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-900">App</span>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return (
                    <span key={to} className="flex items-center">
                        <span className="mx-2">/</span>
                        {isLast ? (
                            <span className="capitalize font-semibold text-gray-800">{value}</span>
                        ) : (
                            <Link to={to} className="capitalize hover:text-primary-600 hover:underline">{value}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
            <div className="flex flex-col justify-center">
                <Breadcrumb />
            </div>

            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                    >
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {initials}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-700 leading-none">{displayName}</p>
                            <p className="text-xs text-gray-500">{displayRole}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">Signed in as</p>
                                <p className="text-sm text-gray-500 truncate">{displayEmail}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                                <User size={16} className="mr-2" /> Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                                <Settings size={16} className="mr-2" /> Settings
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                            >
                                <LogOut size={16} className="mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
