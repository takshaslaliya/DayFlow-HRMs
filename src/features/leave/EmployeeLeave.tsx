import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, X, Send, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusBadge, getLeaveStatusVariant, getLeaveTypeVariant } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { getMyLeaves, createLeaveRequest } from './api';
import type { LeaveRequest } from '@/types';

export const EmployeeLeave: React.FC = () => {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'paid',
        startDate: '',
        endDate: '',
        reason: '',
    });

    // Fetch My Leaves
    const { data: myLeaves = [], isLoading } = useQuery({
        queryKey: ['my-leaves', user?.id],
        queryFn: () => getMyLeaves(user?.id!),
        enabled: !!user?.id,
    });

    // Create Leave Mutation
    const createMutation = useMutation({
        mutationFn: (data: typeof formData) => createLeaveRequest(user?.id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
            toast.success('Leave request submitted successfully!');
            setIsApplyModalOpen(false);
            setFormData({ type: 'paid', startDate: '', endDate: '', reason: '' });
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to submit leave request');
        }
    });

    // Stats
    const stats = {
        pending: myLeaves.filter((r: LeaveRequest) => r.status === 'PENDING').length,
        approved: myLeaves.filter((r: LeaveRequest) => r.status === 'APPROVED').length,
        rejected: myLeaves.filter((r: LeaveRequest) => r.status === 'REJECTED').length,
        totalDays: myLeaves
            .filter((r: LeaveRequest) => r.status === 'APPROVED')
            .reduce((acc: number, r: LeaveRequest) => acc + differenceInDays(parseISO(r.end_date), parseISO(r.start_date)) + 1, 0),
    };

    const handleSubmit = () => {
        if (!formData.startDate || !formData.endDate || !formData.reason) {
            toast.error('Please fill in all fields');
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
                        <p className="text-gray-500">Apply for leaves and track your requests</p>
                    </div>
                    <Button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Apply for Leave
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Pending', value: stats.pending, variant: 'warning' as const },
                        { label: 'Approved', value: stats.approved, variant: 'success' as const },
                        { label: 'Rejected', value: stats.rejected, variant: 'destructive' as const },
                        { label: 'Days Used', value: stats.totalDays, variant: 'primary' as const },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm"
                        >
                            <div className="mb-2 flex justify-center">
                                <StatusBadge variant={stat.variant} className="mb-0">
                                    {stat.label}
                                </StatusBadge>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Leave List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                    <h3 className="font-semibold text-gray-900 mb-4">My Leave Requests</h3>

                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                        </div>
                    ) : myLeaves.length === 0 ? (
                        <EmptyState
                            title="No Leave Requests"
                            description="You haven't applied for any leaves yet."
                            action={{
                                label: 'Apply for Leave',
                                onClick: () => setIsApplyModalOpen(true),
                            }}
                        />
                    ) : (
                        <div className="space-y-4">
                            {myLeaves.map((leave: LeaveRequest, index: number) => (
                                <motion.div
                                    key={leave.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <StatusBadge variant={getLeaveTypeVariant(leave.leave_type.toLowerCase())}>
                                                {/* @ts-ignore - simple text transform */}
                                                {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1).toLowerCase()} Leave
                                            </StatusBadge>
                                            <StatusBadge variant={getLeaveStatusVariant(leave.status.toLowerCase())}>
                                                {/* @ts-ignore - simple text transform */}
                                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1).toLowerCase()}
                                            </StatusBadge>
                                        </div>
                                        <p className="text-sm text-gray-900 font-medium mb-1">{leave.reason}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {format(parseISO(leave.start_date), 'MMM d')} - {format(parseISO(leave.end_date), 'MMM d, yyyy')}
                                            </span>
                                            <span>
                                                {differenceInDays(parseISO(leave.end_date), parseISO(leave.start_date)) + 1} days
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Applied: {format(parseISO(leave.applied_at), 'MMM d, yyyy')}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Apply Leave Modal */}
            <Modal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                title="Apply for Leave"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Leave Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="paid">Paid Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="unpaid">Unpaid Leave</option>
                            <option value="personal">Personal Leave</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason
                        </label>
                        <Textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Please provide a reason for your leave request..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsApplyModalOpen(false)}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-primary-600 hover:bg-primary-700"
                            onClick={handleSubmit}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Submit Request
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageTransition>
    );
};
