import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    FileText,
    DollarSign,
    LogIn,
    LogOut,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { attendanceRecords, leaveRequests, recentActivities } from '@/lib/mockData';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayAttendance, checkIn, checkOut } from '@/features/attendance/api';
import { toast } from 'sonner';

export const EmployeeDashboard: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const queryClient = useQueryClient();

    // Fetch Today's Attendance
    const { data: todayAttendance, isLoading: isLoadingAttendance } = useQuery({
        queryKey: ['today-attendance', user?.id],
        queryFn: () => getTodayAttendance(user?.id!),
        enabled: !!user?.id,
    });

    // Check In Mutation
    const checkInMutation = useMutation({
        mutationFn: () => checkIn(user?.id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
            toast.success('checked in successfully!');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to check in');
        }
    });

    // Check Out Mutation
    const checkOutMutation = useMutation({
        mutationFn: () => checkOut(todayAttendance?.id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
            toast.success('checked out successfully!');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to check out');
        }
    });

    // Determine state
    const isCheckedIn = !!todayAttendance && !todayAttendance.check_out;
    const isCheckedOut = !!todayAttendance?.check_out;

    // Filter data for current employee (mock ID '2')
    const myAttendance = attendanceRecords.filter(r => r.employeeId === '2');
    const myLeaves = leaveRequests.filter(r => r.employeeId === '2');

    // Calculate stats
    const presentDays = myAttendance.filter(r => r.status === 'present').length;
    const leavesTaken = myLeaves.filter(r => r.status === 'approved').length;
    const pendingLeaves = myLeaves.filter(r => r.status === 'pending').length;

    // Generate week calendar
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const handleCheckIn = () => {
        checkInMutation.mutate();
    };

    const handleCheckOut = () => {
        if (!todayAttendance?.id) return;
        checkOutMutation.mutate();
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'check-in':
                return <LogIn className="w-4 h-4 text-green-500" />;
            case 'check-out':
                return <LogOut className="w-4 h-4 text-primary-500" />;
            case 'leave-approved':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'leave-rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        }
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {(user?.metadata?.name || user?.email || 'User').split(' ')[0]}! 👋
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Here's your work summary for today
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            {format(today, 'EEEE, MMMM d, yyyy')}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Present Days"
                        value={presentDays}
                        subtitle="This month"
                        icon={Calendar}
                        variant="blue"
                        delay={0}
                    />
                    <StatCard
                        title="Leaves Taken"
                        value={leavesTaken}
                        subtitle={`${pendingLeaves} pending`}
                        icon={FileText}
                        variant="violet"
                        delay={0.1}
                    />
                    <StatCard
                        title="Work Hours"
                        value="168h"
                        subtitle="This month"
                        icon={Clock}
                        variant="violet"
                        delay={0.2}
                    />
                    <StatCard
                        title="Net Salary"
                        value="$7,500"
                        subtitle="This month"
                        icon={DollarSign}
                        variant="emerald"
                        delay={0.3}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Check In/Out Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100"
                    >
                        <h3 className="font-semibold text-gray-900 mb-4">Today's Attendance</h3>

                        <div className="text-center py-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-200">
                                {checkInMutation.isPending || checkOutMutation.isPending || isLoadingAttendance ? (
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                ) : (
                                    <Clock className="w-10 h-10 text-white" />
                                )}
                            </div>

                            {isCheckedOut ? (
                                <>
                                    <p className="text-gray-500 font-medium mb-1">Shift Completed</p>
                                    <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
                                        <span>In: {todayAttendance.check_in.slice(0, 5)}</span>
                                        <span>Out: {todayAttendance.check_out?.slice(0, 5)}</span>
                                    </div>
                                    <Button
                                        disabled
                                        className="w-full bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Completed
                                    </Button>
                                </>
                            ) : isCheckedIn ? (
                                <>
                                    <p className="text-green-600 font-medium mb-1">Checked In</p>
                                    <p className="text-gray-500 text-sm mb-4">at {todayAttendance.check_in.slice(0, 5)}</p>
                                    <Button
                                        onClick={handleCheckOut}
                                        disabled={checkOutMutation.isPending}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Check Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-4">Not checked in yet</p>
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInMutation.isPending}
                                        className="w-full"
                                    >
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Check In
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Weekly Calendar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100"
                    >
                        <h3 className="font-semibold text-gray-900 mb-4">This Week's Attendance</h3>

                        <div className="grid grid-cols-7 gap-2">
                            {weekDays.map((day, index) => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const record = myAttendance.find(r => r.date === dateStr);
                                const isToday = isSameDay(day, today);
                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                                return (
                                    <div
                                        key={index}
                                        className={`text-center p-3 rounded-xl transition-all ${isToday
                                            ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                                            : isWeekend
                                                ? 'bg-gray-50'
                                                : 'bg-white border border-gray-100'
                                            }`}
                                    >
                                        <p className={`text-xs font-medium mb-1 ${isToday ? 'text-primary-100' : 'text-gray-400'}`}>
                                            {format(day, 'EEE')}
                                        </p>
                                        <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                                            {format(day, 'd')}
                                        </p>
                                        {record && !isToday && (
                                            <div className="mt-2 flex justify-center">
                                                <span className={`block w-1.5 h-1.5 rounded-full ${record.status === 'present' ? 'bg-green-500' :
                                                    record.status === 'late' ? 'bg-yellow-500' :
                                                        record.status === 'absent' ? 'bg-red-500' : 'bg-gray-300'
                                                    }`} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-gray-500">Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="text-xs text-gray-500">Late</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs text-gray-500">Absent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300" />
                                <span className="text-xs text-gray-500">Leave</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100"
                >
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>

                    <div className="space-y-4">
                        {recentActivities.slice(0, 5).map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                                    <p className="text-xs text-gray-500">
                                        {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};
