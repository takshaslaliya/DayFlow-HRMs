import { useAuth } from '@/features/auth/hooks/useAuth';
import { EmployeeDashboard } from './EmployeeDashboard';
import { KPIStats } from './components/KPIStats';
import { AttendanceCharts } from './components/AttendanceCharts';
import { QuickActions } from './components/QuickActions';

const Dashboard = () => {
    const { user } = useAuth();
    const isEmployee = (user as any)?.role === 'employee';

    if (isEmployee) {
        return <EmployeeDashboard />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <KPIStats />

            <QuickActions />

            <AttendanceCharts />

        </div>
    );
};

export default Dashboard;
