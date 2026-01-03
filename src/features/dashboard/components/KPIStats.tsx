import { Users, UserCheck, UserX, Clock, CreditCard } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

export function KPIStats() {
    const { stats, isLoading } = useDashboard();

    const statsData = [
        {
            label: 'Total Employees',
            value: isLoading ? '...' : stats?.totalEmployees.toString() || '0',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Present Today',
            value: isLoading ? '...' : stats?.presentToday.toString() || '0',
            icon: UserCheck,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Absent Today',
            value: isLoading ? '...' : stats?.absentToday.toString() || '0',
            icon: UserX,
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        {
            label: 'Leaves Pending',
            value: isLoading ? '...' : stats?.leavesPending.toString() || '0',
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        {
            label: 'Salary Processed',
            value: isLoading ? '...' : `$${(stats?.salaryProcessed || 0).toLocaleString()}`,
            icon: CreditCard,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statsData.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
