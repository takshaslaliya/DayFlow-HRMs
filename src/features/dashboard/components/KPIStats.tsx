import { Users, UserCheck, UserX, Clock, CreditCard } from 'lucide-react';

const stats = [
    { label: 'Total Employees', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present Today', value: '112', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Absent Today', value: '12', icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Leaves Pending', value: '5', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Salary Processed', value: '$84k', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export function KPIStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => (
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
