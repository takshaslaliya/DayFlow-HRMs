import { useState, useEffect } from 'react';
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
    X,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeByUserId } from '../employees/api';
import { SalaryCard } from '../salary/components/SalaryCard';

export const EmployeeProfile: React.FC = () => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    const { data: employeeData, isLoading } = useQuery({
        queryKey: ['employee-profile', user?.id],
        queryFn: () => getEmployeeByUserId(user?.id || ''),
        enabled: !!user?.id,
    });

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
    });

    // Initialize form data when employee data is loaded
    useEffect(() => {
        if (employeeData) {
            setFormData({
                phone: employeeData.phone || '',
                address: employeeData.address || '',
            });
        }
    }, [employeeData]);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!employeeData) {
        return <div>Employee profile not found.</div>;
    }

    const employeeName = `${employeeData.first_name} ${employeeData.last_name}`;
    const salary = Array.isArray(employeeData.salaries) ? employeeData.salaries[0] : employeeData.salaries;

    const infoItems = [
        { icon: Mail, label: 'Email', value: (employeeData as { user?: { email: string } }).user?.email || 'N/A' },
        { icon: Phone, label: 'Phone', value: employeeData.phone || 'N/A' },
        { icon: MapPin, label: 'Address', value: employeeData.address || 'N/A' },
        { icon: Building2, label: 'Department', value: employeeData.department },
        { icon: Briefcase, label: 'Position', value: employeeData.designation },
        { icon: Calendar, label: 'Join Date', value: new Date(employeeData.date_of_joining).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
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
                                    src={previewAvatar || employeeData.profile_image}
                                    alt={employeeName}
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
                                <h1 className="text-2xl font-bold text-gray-900">{employeeName}</h1>
                                <p className="text-gray-500">{employeeData.designation} • {employeeData.department}</p>
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

                {/* Salary Overview */}
                {salary && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <SalaryCard salary={salary} />
                    </motion.div>
                )}
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
