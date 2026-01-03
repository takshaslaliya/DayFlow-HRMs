import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { attendanceRecords } from '@/lib/mockData';
import { StatusBadge, getAttendanceStatusVariant } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

export const EmployeeAttendance: React.FC = () => {
    const [filter, setFilter] = useState<'week' | 'month'>('month');

    // Filter for current employee and date range
    const myAttendance = attendanceRecords
        .filter(r => r.employeeId === '2')
        .filter(r => {
            const recordDate = parseISO(r.date);
            const today = new Date();
            // Adjust start date based on filter
            const start = filter === 'week' ? subDays(today, 7) : subDays(today, 30);
            // Ensure we include future dates up to today if needed, or just checked against range
            return isWithinInterval(recordDate, { start, end: today });
        });

    // Stats
    const stats = {
        present: myAttendance.filter(r => r.status === 'present').length,
        late: myAttendance.filter(r => r.status === 'late').length,
        absent: myAttendance.filter(r => r.status === 'absent').length,
        leave: myAttendance.filter(r => r.status === 'leave').length,
        // @ts-ignore - mockData inference might lag
        totalHours: myAttendance.reduce((acc, r) => acc + (r.workHours || 0), 0).toFixed(1),
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">My Attendance</h2>
                        <p className="text-muted-foreground">Track your daily attendance and work hours</p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2 bg-gray-100/50 rounded-xl p-1 border border-gray-200">
                        <Button
                            variant={filter === 'week' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('week')}
                            className={filter === 'week' ? 'bg-white shadow-sm text-primary-600' : ''}
                        >
                            This Week
                        </Button>
                        <Button
                            variant={filter === 'month' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('month')}
                            className={filter === 'month' ? 'bg-white shadow-sm text-primary-600' : ''}
                        >
                            This Month
                        </Button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Present', value: stats.present, color: 'bg-green-500' },
                        { label: 'Late', value: stats.late, color: 'bg-yellow-500' },
                        { label: 'Absent', value: stats.absent, color: 'bg-red-500' },
                        { label: 'On Leave', value: stats.leave, color: 'bg-gray-400' },
                        { label: 'Total Hours', value: `${stats.totalHours}h`, color: 'bg-blue-500' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm"
                        >
                            <div className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-2`} />
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Attendance Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Day</th>
                                    <th className="px-6 py-4">Check In</th>
                                    <th className="px-6 py-4">Check Out</th>
                                    <th className="px-6 py-4">Work Hours</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myAttendance.map((record, index) => (
                                    <motion.tr
                                        key={record.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {format(parseISO(record.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(parseISO(record.date), 'EEEE')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.checkIn ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>{record.checkIn}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.checkOut ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>{record.checkOut}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {record.workHours > 0 ? `${record.workHours}h` : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge variant={getAttendanceStatusVariant(record.status)}>
                                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                            </StatusBadge>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};
