
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase,
    Calendar,
    X,
    DollarSign,
    Plus
} from 'lucide-react';
import { employees as initialEmployees } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/layout/PageTransition';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

export const AdminEmployees: React.FC = () => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [selectedEmployee, setSelectedEmployee] = useState<typeof initialEmployees[0] | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        address: '',
        salary: '',
        joinDate: format(new Date(), 'yyyy-MM-dd')
    });

    const departments = ['all', ...new Set(employees.map(e => e.department))];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
        return matchesSearch && matchesDepartment;
    });

    const handleAddEmployee = () => {
        if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
            toast.error('Please fill in all required fields');
            return;
        }

        const employee = {
            id: (employees.length + 1).toString(),
            ...newEmployee,
            salary: Number(newEmployee.salary) || 0,
            status: 'active' as const,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmployee.name)}&background=random`,
        };

        setEmployees([...employees, employee]);
        setIsAddModalOpen(false);
        setNewEmployee({
            name: '',
            email: '',
            position: '',
            department: '',
            phone: '',
            address: '',
            salary: '',
            joinDate: format(new Date(), 'yyyy-MM-dd')
        });
        toast.success('Employee added successfully');
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
                        <p className="text-gray-500">Manage your organization's workforce</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Employee
                        </Button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept === 'all' ? 'All Departments' : dept}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Employee Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEmployees.map((employee, index) => (
                                    <motion.tr
                                        key={employee.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={employee.avatar}
                                                    alt={employee.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{employee.name}</p>
                                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{employee.department}</td>
                                        <td className="px-6 py-4 text-gray-500">{employee.position}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(employee.joinDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge variant={employee.status === 'active' ? 'success' : 'muted'}>
                                                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                            </StatusBadge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedEmployee(employee)}
                                                className="hover:bg-primary-50 hover:text-primary-600"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Add Employee Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Employee"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <Input
                                placeholder="John Doe"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <Input
                                placeholder="Engineering"
                                value={newEmployee.department}
                                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Position</label>
                            <Input
                                placeholder="Senior Developer"
                                value={newEmployee.position}
                                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <Input
                                placeholder="+1 (555) 000-0000"
                                value={newEmployee.phone}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Salary (Annual)</label>
                            <Input
                                type="number"
                                placeholder="50000"
                                value={newEmployee.salary}
                                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <Input
                            placeholder="123 Main St, City, Country"
                            value={newEmployee.address}
                            onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddEmployee} className="bg-primary-600 hover:bg-primary-700 text-white">
                            Add Employee
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Employee Detail Drawer */}
            <AnimatePresence>
                {selectedEmployee && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            onClick={() => setSelectedEmployee(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedEmployee(null)}
                                        className="rounded-full hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Profile Header */}
                                <div className="text-center mb-6">
                                    <img
                                        src={selectedEmployee.avatar}
                                        alt={selectedEmployee.name}
                                        className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border-4 border-gray-50"
                                    />
                                    <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                                    <p className="text-gray-500">{selectedEmployee.position}</p>
                                    <div className="flex justify-center mt-2">
                                        <StatusBadge variant={selectedEmployee.status === 'active' ? 'success' : 'muted'}>
                                            {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                                        </StatusBadge>
                                    </div>
                                </div>

                                {/* Info Cards */}
                                <div className="space-y-4">
                                    {[
                                        { icon: Mail, label: 'Email', value: selectedEmployee.email },
                                        { icon: Phone, label: 'Phone', value: selectedEmployee.phone },
                                        { icon: Building2, label: 'Department', value: selectedEmployee.department },
                                        { icon: Briefcase, label: 'Position', value: selectedEmployee.position },
                                        { icon: Calendar, label: 'Join Date', value: format(new Date(selectedEmployee.joinDate), 'MMMM d, yyyy') },
                                        { icon: MapPin, label: 'Address', value: selectedEmployee.address },
                                        { icon: DollarSign, label: 'Annual Salary', value: `$${selectedEmployee.salary.toLocaleString()} ` },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                                                <item.icon className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{item.label}</p>
                                                <p className="font-medium text-gray-900">{item.value}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};
