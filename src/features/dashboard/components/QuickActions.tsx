import { Plus, CheckSquare, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                    className="w-full justify-start h-auto py-3"
                    onClick={() => navigate('/employees')}
                >
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Plus size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium">Add Employee</span>
                        <span className="text-xs text-gray-500 font-normal">Onboard new staff</span>
                    </div>
                </Button>

                <Button
                    className="w-full justify-start h-auto py-3"
                    variant="outline"
                    onClick={() => navigate('/attendance')}
                >
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <CheckSquare size={20} className="text-green-600" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium">Mark Attendance</span>
                        <span className="text-xs text-gray-500 font-normal">Log daily entry</span>
                    </div>
                </Button>

                <Button
                    className="w-full justify-start h-auto py-3"
                    variant="outline"
                    onClick={() => navigate('/leave')}
                >
                    <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                        <FileText size={20} className="text-yellow-600" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium">Apply Leave</span>
                        <span className="text-xs text-gray-500 font-normal">Request time off</span>
                    </div>
                </Button>

                <Button
                    className="w-full justify-start h-auto py-3"
                    variant="outline"
                    onClick={() => navigate('/salary')}
                >
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <DollarSign size={20} className="text-purple-600" />
                    </div>
                    <div className="text-left">
                        <span className="block font-medium">Generate Salary</span>
                        <span className="text-xs text-gray-500 font-normal">Process payroll</span>
                    </div>
                </Button>
            </div>
        </div>
    )
}
