import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit2, Save, X, TrendingUp } from 'lucide-react';
import { employees, monthlyPayrollData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';

interface EditableSalary {
    id: string;
    name: string;
    currentSalary: number;
    newSalary: number;
}

export const AdminPayroll: React.FC = () => {
    const [salaries, setSalaries] = useState(
        employees.map(e => ({ id: e.id, name: e.name, salary: e.salary, department: e.department, position: e.position }))
    );
    const [editingEmployee, setEditingEmployee] = useState<EditableSalary | null>(null);

    const totalMonthly = salaries.reduce((acc, e) => acc + e.salary / 12, 0);
    const totalAnnual = salaries.reduce((acc, e) => acc + e.salary, 0);

    const handleEditClick = (emp: typeof salaries[0]) => {
        setEditingEmployee({
            id: emp.id,
            name: emp.name,
            currentSalary: emp.salary,
            newSalary: emp.salary,
        });
    };

    const handleSave = () => {
        if (!editingEmployee) return;

        setSalaries(prev => prev.map(s =>
            s.id === editingEmployee.id
                ? { ...s, salary: editingEmployee.newSalary }
                : s
        ));

        toast.success(`Salary updated for ${editingEmployee.name}`);
        setEditingEmployee(null);
    };

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
                                    ${totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                                    ${totalAnnual.toLocaleString()}
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
                                    ${(totalAnnual / salaries.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                                    tickFormatter={(value) => `$${(value / 1000)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Total Payroll']}
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Annual Salary</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {salaries.map((emp, index) => (
                                    <motion.tr
                                        key={emp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{emp.department}</td>
                                        <td className="px-6 py-4 text-gray-500">{emp.position}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ${emp.salary.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            ${(emp.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(emp)}
                                                className="hover:bg-primary-50 hover:text-primary-600"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Edit Salary Modal */}
            <Modal
                isOpen={!!editingEmployee}
                onClose={() => setEditingEmployee(null)}
                title="Edit Salary"
                size="sm"
            >
                {editingEmployee && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="font-medium text-gray-900">{editingEmployee.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Current Salary: ${editingEmployee.currentSalary.toLocaleString()}/year
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Annual Salary ($)
                            </label>
                            <Input
                                type="number"
                                value={editingEmployee.newSalary}
                                onChange={(e) => setEditingEmployee({
                                    ...editingEmployee,
                                    newSalary: parseInt(e.target.value) || 0
                                })}
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Monthly: ${(editingEmployee.newSalary / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>

                        {editingEmployee.newSalary !== editingEmployee.currentSalary && (
                            <div className={`p-3 rounded-xl ${editingEmployee.newSalary > editingEmployee.currentSalary
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                <p className="text-sm font-medium">
                                    {editingEmployee.newSalary > editingEmployee.currentSalary ? '↑' : '↓'}
                                    {' '}${Math.abs(editingEmployee.newSalary - editingEmployee.currentSalary).toLocaleString()}
                                    {' '}({((editingEmployee.newSalary - editingEmployee.currentSalary) / editingEmployee.currentSalary * 100).toFixed(1)}%)
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setEditingEmployee(null)}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                                onClick={handleSave}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </PageTransition>
    );
};
