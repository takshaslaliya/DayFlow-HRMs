import { LoginForm } from './components/LoginForm';

export function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-col relative bg-slate-900 text-white p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497294815431-9365093b7331?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 mt-auto mb-32">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                            <span className="text-xl font-bold">D</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">DayFlow</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight leading-tight mb-6">
                        Manage your workforce <br />
                        <span className="text-blue-400">efficiently</span> and <span className="text-purple-400">securely</span>.
                    </h1>
                    <p className="text-lg text-gray-400 max-w-sm">
                        Streamline your HR operations with our comprehensive management dashboard using AI.
                    </p>
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
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                             Please enter your details to sign in
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
