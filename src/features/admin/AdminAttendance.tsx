import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge, getAttendanceStatusVariant } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import { getAllAttendance } from '@/features/attendance/api';
import type { AttendanceRecord } from '@/types';

export const AdminAttendance: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('week');

    // Fetch All Attendance
    const { data: attendanceData = [], isLoading } = useQuery({
        queryKey: ['all-attendance'],
        queryFn: getAllAttendance
    });

    // Filter records
    const filteredRecords = attendanceData
        .filter((r: AttendanceRecord) => {
            const employeeName = r.employee
                ? `${r.employee.first_name} ${r.employee.last_name}`
                : 'Unknown';
            const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase());

            const recordDate = parseISO(r.attendance_date);
            const today = new Date();

            let start: Date;
            switch (dateFilter) {
                case 'today':
                    start = new Date(today.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    start = subDays(today, 7);
                    break;
                case 'month':
                    start = subDays(today, 30);
                    break;
            }

            return matchesSearch && isWithinInterval(recordDate, { start, end: new Date() });
        })
        .slice(0, 50);

    // Stats
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = attendanceData.filter((r: AttendanceRecord) => r.attendance_date === todayStr);
    const stats = {
        present: todayRecords.filter((r: AttendanceRecord) => r.status === 'PRESENT').length,
        late: todayRecords.filter((r: AttendanceRecord) => r.status === 'LATE').length,
        absent: todayRecords.filter((r: AttendanceRecord) => r.status === 'ABSENT').length,
        // Assuming we map HALF_DAY to on leave or similar for basic stats
        onLeave: todayRecords.filter((r: AttendanceRecord) => r.status === 'HALF_DAY').length,
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                        <p className="text-gray-500">Track and manage employee attendance</p>
                    </div>
                </div>

                {/* Today's Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Present Today', value: stats.present, color: 'bg-emerald-500' },
                        { label: 'Late Today', value: stats.late, color: 'bg-yellow-500' },
                        { label: 'Absent Today', value: stats.absent, color: 'bg-red-500' },
                        { label: 'Half Day/Leave', value: stats.onLeave, color: 'bg-gray-500' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 ${stat.color} rounded-full`} />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by employee name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        {(['today', 'week', 'month'] as const).map((filter) => (
                            <Button
                                key={filter}
                                variant={dateFilter === filter ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setDateFilter(filter)}
                                className={`capitalize ${dateFilter === filter ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-500">Status Legend:</span>
                    {[
                        { label: 'Present', variant: 'success' },
                        { label: 'Late', variant: 'warning' },
                        { label: 'Absent', variant: 'destructive' },
                        { label: 'Half Day', variant: 'muted' },
                    ].map((item) => (
                        <StatusBadge key={item.label} variant={item.variant as any}>
                            {item.label}
                        </StatusBadge>
                    ))}
                </div>

                {/* Attendance Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No attendance records found for this period.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Check In</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Work Hours</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRecords.map((record: AttendanceRecord, index: number) => (
                                        <motion.tr
                                            key={record.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.02 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {record.employee
                                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                                    : 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(parseISO(record.attendance_date), 'MMM d, yyyy')}
                                                </div>
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
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {record.total_hours ? `${record.total_hours}h` : '—'}
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
