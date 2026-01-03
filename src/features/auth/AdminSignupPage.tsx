import { AdminSignupForm } from './components/AdminSignupForm';

export function AdminSignupPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 mt-auto mb-32">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                            <span className="text-xl font-bold">D</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">DayFlow</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight leading-tight mb-6">
                        Welcome to <br />
                        <span className="text-blue-400">DayFlow</span> Admin Portal
                    </h1>
                    <p className="text-lg text-gray-300 max-w-sm">
                        Create your admin account to start managing your workforce efficiently with our AI-powered HR management system.
                    </p>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-6 w-6 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Employee Management</h3>
                                <p className="text-sm text-gray-400">Manage your team with ease</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-6 w-6 bg-purple-500/20 rounded-lg flex items-center justify-center mt-0.5">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Attendance Tracking</h3>
                                <p className="text-sm text-gray-400">Real-time attendance monitoring</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-6 w-6 bg-pink-500/20 rounded-lg flex items-center justify-center mt-0.5">
                                <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Payroll Management</h3>
                                <p className="text-sm text-gray-400">Automated salary calculations</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © 2024 DayFlow Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Create Admin Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Set up your admin credentials to get started
                        </p>
                    </div>

                    <AdminSignupForm />
                </div>
            </div>
        </div>
    );
}
