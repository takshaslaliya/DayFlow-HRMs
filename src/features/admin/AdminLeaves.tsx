import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Calendar, Filter } from 'lucide-react';
import { leaveRequests } from '@/lib/mockData';
import { StatusBadge, getLeaveStatusVariant, getLeaveTypeVariant } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/textarea';
import { PageTransition } from '@/components/layout/PageTransition';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export const AdminLeaves: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedLeave, setSelectedLeave] = useState<typeof leaveRequests[0] | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [comment, setComment] = useState('');
    const [leaves, setLeaves] = useState(leaveRequests);

    const filteredLeaves = leaves.filter(leave =>
        statusFilter === 'all' || leave.status === statusFilter
    );

    const stats = {
        pending: leaves.filter(r => r.status === 'pending').length,
        approved: leaves.filter(r => r.status === 'approved').length,
        rejected: leaves.filter(r => r.status === 'rejected').length,
    };

    const handleAction = (leave: typeof leaveRequests[0], action: 'approve' | 'reject') => {
        setSelectedLeave(leave);
        setActionType(action);
    };

    const confirmAction = () => {
        if (!selectedLeave || !actionType) return;

        setLeaves(prev => prev.map(leave =>
            leave.id === selectedLeave.id
                ? { ...leave, status: actionType === 'approve' ? 'approved' : 'rejected' }
                : leave
        ));

        toast.success(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setSelectedLeave(null);
        setActionType(null);
        setComment('');
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
                    <p className="text-gray-500">Review and manage employee leave applications</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Pending', value: stats.pending, variant: 'warning' as const, filter: 'pending' as const },
                        { label: 'Approved', value: stats.approved, variant: 'success' as const, filter: 'approved' as const },
                        { label: 'Rejected', value: stats.rejected, variant: 'destructive' as const, filter: 'rejected' as const },
                    ].map((stat, index) => (
                        <motion.button
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setStatusFilter(stat.filter)}
                            className={`bg-white border rounded-xl p-4 text-left transition-all hover:shadow-md ${statusFilter === stat.filter ? 'ring-2 ring-primary-500 border-transparent' : 'border-gray-200'
                                }`}
                        >
                            <div className="mb-2">
                                <StatusBadge variant={stat.variant}>
                                    {stat.label}
                                </StatusBadge>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </motion.button>
                    ))}
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                            <Button
                                key={filter}
                                variant={statusFilter === filter ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setStatusFilter(filter)}
                                className={statusFilter === filter ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Leave Requests List */}
                <div className="space-y-4">
                    {filteredLeaves.map((leave, index) => (
                        <motion.div
                            key={leave.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Employee Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <img
                                        src={leave.employeeAvatar || 'https://via.placeholder.com/150'}
                                        alt={leave.employeeName}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{leave.employeeName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusBadge variant={getLeaveTypeVariant(leave.type)}>
                                                {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                                            </StatusBadge>
                                            <StatusBadge variant={getLeaveStatusVariant(leave.status)}>
                                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                            </StatusBadge>
                                        </div>
                                    </div>
                                </div>

                                {/* Leave Details */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 mb-2">{leave.reason}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d, yyyy')}
                                        </span>
                                        <span>
                                            ({differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1} days)
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Applied on {format(parseISO(leave.appliedOn), 'MMM d, yyyy')}
                                    </p>
                                </div>

                                {/* Actions */}
                                {leave.status === 'pending' && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handleAction(leave, 'approve')}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(leave, 'reject')}
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Action Modal */}
            <Modal
                isOpen={!!selectedLeave && !!actionType}
                onClose={() => {
                    setSelectedLeave(null);
                    setActionType(null);
                    setComment('');
                }}
                title={actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                size="sm"
            >
                <div className="space-y-4">
                    {selectedLeave && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="font-medium text-gray-900">{selectedLeave.employeeName}</p>
                            <p className="text-sm text-gray-500 mt-1">{selectedLeave.reason}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {format(parseISO(selectedLeave.startDate), 'MMM d')} - {format(parseISO(selectedLeave.endDate), 'MMM d, yyyy')}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments (Optional)
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setSelectedLeave(null);
                                setActionType(null);
                                setComment('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={`flex-1 text-white ${actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                            onClick={confirmAction}
                        >
                            {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageTransition>
    );
};
