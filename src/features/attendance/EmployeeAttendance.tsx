import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge, getAttendanceStatusVariant } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { useAuthStore } from '@/store/auth.store';
import { getMyAttendance } from './api';
import type { AttendanceRecord } from '@/types';

export const EmployeeAttendance: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const [filter, setFilter] = useState<'week' | 'month'>('month');

    const { data: attendanceData = [], isLoading } = useQuery({
        queryKey: ['my-attendance', user?.id],
        queryFn: () => getMyAttendance(user?.id!),
        enabled: !!user?.id,
    });

    // Filter for current employee and date range
    const myAttendance = attendanceData.filter((r: AttendanceRecord) => {
        // Attendance API already filters by user, just need date filter locally if desired, 
        // passing date filter to API is better but this works for small data
        const recordDate = parseISO(r.date);
        const today = new Date();
        const start = filter === 'week' ? subDays(today, 7) : subDays(today, 30);
        return isWithinInterval(recordDate, { start, end: today });
    });

    // Stats
    const stats = {
        present: myAttendance.filter((r: AttendanceRecord) => r.status === 'PRESENT').length,
        late: myAttendance.filter((r: AttendanceRecord) => r.status === 'LATE').length,
        absent: myAttendance.filter((r: AttendanceRecord) => r.status === 'ABSENT').length,
        leave: myAttendance.filter((r: AttendanceRecord) => r.status === 'HALF_DAY').length, // Mapping HALF_DAY to "Leave" concept for now or create generic
        totalHours: myAttendance.reduce((acc: number, r: AttendanceRecord) => acc + (r.work_hours || 0), 0).toFixed(1),
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
                        { label: 'Half Day/Leave', value: stats.leave, color: 'bg-gray-400' },
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
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : myAttendance.length === 0 ? (
                        <EmptyState
                            title="No Attendance Records"
                            description="You haven't checked in yet for this period."
                        />
                    ) : (
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
                                    {myAttendance.map((record: AttendanceRecord, index: number) => (
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
                                                {record.check_in ? (
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{record.check_in.slice(0, 5)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.check_out ? (
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{record.check_out.slice(0, 5)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                {record.work_hours ? `${record.work_hours}h` : '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge variant={getAttendanceStatusVariant(record.status.toLowerCase())}>
                                                    {/* @ts-ignore */}
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
                                                </StatusBadge>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </PageTransition>
    );
};
