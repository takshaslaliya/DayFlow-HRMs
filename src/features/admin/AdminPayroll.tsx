import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit2, TrendingUp, Loader2 } from 'lucide-react';
import { monthlyPayrollData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { PageTransition } from '@/components/layout/PageTransition';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getPayrollData } from '../salary/api';
import { SalaryForm } from '../salary/components/SalaryForm';
import { SalaryComponents } from '../salary/components/SalaryComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminPayroll: React.FC = () => {
    const [selectedEmployee, setSelectedEmployee] = useState<{ id: string, name: string, salary: any } | null>(null);

    const { data: payrollData, isLoading } = useQuery({
        queryKey: ['payroll-data'],
        queryFn: getPayrollData,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const processedSalaries = payrollData?.map(emp => ({
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: emp.department,
        designation: emp.designation,
        salary: Array.isArray(emp.salaries) ? emp.salaries[0] : emp.salaries
    })) || [];

    const totalMonthly = processedSalaries.reduce((acc, e) => acc + (e.salary?.monthly_ctc || 0), 0);
    const totalAnnual = processedSalaries.reduce((acc, e) => acc + (e.salary?.yearly_ctc || 0), 0);

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
                    <p className="text-gray-500">Manage employee salaries and compensation</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Monthly Payroll</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{totalMonthly.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Annual Payroll</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{totalAnnual.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Average Salary</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{processedSalaries.length ? (totalAnnual / processedSalaries.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Payroll Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                    <h3 className="font-semibold text-gray-900 mb-4">Monthly Payroll Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyPayrollData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis
                                    stroke="#9ca3af"
                                    tickFormatter={(value) => `₹${(value / 1000)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: number | undefined) => [`₹${(value || 0).toLocaleString()}`, 'Total Payroll']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Salary Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Annual CTC</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {processedSalaries.map((emp, index) => (
                                    <motion.tr
                                        key={emp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{emp.department}</td>
                                        <td className="px-6 py-4 text-gray-500">{emp.designation}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{emp.salary?.yearly_ctc?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            ₹{emp.salary?.monthly_ctc?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedEmployee(emp)}
                                                className="hover:bg-primary-50 hover:text-primary-600"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Manage
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Manage Payroll Modal */}
            <Modal
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                title={`Manage Payroll: ${selectedEmployee?.name}`}
                size="lg"
            >
                {selectedEmployee && (
                    <Tabs defaultValue="settings" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="settings">Salary Settings</TabsTrigger>
                            <TabsTrigger value="components" disabled={!selectedEmployee.salary}>
                                Components
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="settings">
                            <SalaryForm
                                employeeId={selectedEmployee.id}
                                initialData={selectedEmployee.salary}
                                onSuccess={() => { }}
                            />
                        </TabsContent>
                        <TabsContent value="components">
                            {selectedEmployee.salary && (
                                <SalaryComponents salaryId={selectedEmployee.salary.id} />
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </Modal>
        </PageTransition>
    );
};
