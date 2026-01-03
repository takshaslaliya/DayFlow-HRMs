import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import Dashboard from '@/features/dashboard/Dashboard';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

import { LoginPage } from '@/features/auth/LoginPage';
import { AttendancePage } from '@/features/attendance/AttendancePage';
import { LeavePage } from '@/features/leave/LeavePage';
import { EmployeeProfile } from '@/features/profile/EmployeeProfile';
import { AdminEmployees } from '@/features/admin/AdminEmployees';
import { AdminPayroll } from '@/features/admin/AdminPayroll';
import { AdminSignupPage } from '@/features/auth/AdminSignupPage';

// Placeholder components for lazy loading
// const Login = () => <div>Login Page</div>;

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<AdminSignupPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<EmployeeProfile />} />
                        <Route path="/attendance" element={<AttendancePage />} />
                        <Route path="/leave" element={<LeavePage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<AdminLayout />}>
                        <Route path="/employees" element={<AdminEmployees />} />
                        <Route path="/salary" element={<AdminPayroll />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
