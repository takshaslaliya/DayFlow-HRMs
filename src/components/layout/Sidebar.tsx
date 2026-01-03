import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    DollarSign,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
}

const adminNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: FileText, label: 'Leave Requests', path: '/leave' },
    { icon: DollarSign, label: 'Payroll', path: '/salary' },
];

const employeeNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: FileText, label: 'Leave', path: '/leave' },
];

interface SidebarProps {
    onLogoutClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogoutClick }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();
    const role = (user as any)?.role || 'employee';
    const location = useLocation();

    const navItems = role === 'admin' ? adminNavItems : employeeNavItems;

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                'sticky top-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">D</span>
                            </div>
                            <span className="font-bold text-xl gradient-text">Dayflow</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'nav-item',
                                isActive && 'active',
                                isCollapsed && 'justify-center px-3'
                            )}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={onLogoutClick}
                    className={cn(
                        'nav-item w-full text-destructive hover:bg-destructive/10',
                        isCollapsed && 'justify-center px-3'
                    )}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-medium whitespace-nowrap overflow-hidden"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
};
