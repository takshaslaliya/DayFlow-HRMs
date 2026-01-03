import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase,
    Calendar,
    Edit2,
    Save,
    X
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { employees } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';

export const EmployeeProfile: React.FC = () => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    // Use user.id if available and match, otherwise fallback to mock '2'
    const employee = employees.find(e => e.id === (user as any)?.id) || employees.find(e => e.id === '2') || employees[0];

    const [formData, setFormData] = useState({
        phone: employee.phone,
        address: employee.address,
    });

    const handleSave = () => {
        setIsEditModalOpen(false);
        toast.success('Profile updated successfully!');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const infoItems = [
        { icon: Mail, label: 'Email', value: employee.email },
        { icon: Phone, label: 'Phone', value: formData.phone },
        { icon: MapPin, label: 'Address', value: formData.address },
        { icon: Building2, label: 'Department', value: employee.department },
        { icon: Briefcase, label: 'Position', value: employee.position },
        { icon: Calendar, label: 'Join Date', value: new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    ];

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={previewAvatar || employee.avatar}
                                    alt={employee.name}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                                />
                                <label className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-sm">
                                    <Camera className="w-4 h-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>

                            {/* Name & Role */}
                            <div className="flex-1 md:pb-2 pt-2 md:pt-0">
                                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                                <p className="text-gray-500">{employee.position} • {employee.department}</p>
                            </div>

                            {/* Edit Button */}
                            <Button
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-primary-600 hover:bg-primary-700 text-white mb-2 md:mb-0"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {infoItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className="font-medium text-gray-900 truncate">{item.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Salary Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                    <h3 className="font-semibold text-gray-900 mb-4">Salary Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Base Salary</p>
                            <p className="text-2xl font-bold text-gray-900">${employee.salary.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">per year</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Monthly Gross</p>
                            <p className="text-2xl font-bold text-gray-900">${(employee.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-gray-400">before deductions</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <p className="text-sm text-emerald-600 mb-1">Net Monthly</p>
                            <p className="text-2xl font-bold text-emerald-700">${((employee.salary / 12) * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-emerald-600">after deductions</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <Input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter address"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditModalOpen(false)}
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
            </Modal>
        </PageTransition>
    );
};
