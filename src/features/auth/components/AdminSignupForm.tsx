import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';
import { signupSchema, type SignupInput } from '../signup.schema';

export function AdminSignupForm() {
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    const password = watch('password', '');

    // Password strength indicator
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (data: SignupInput) => {
        try {
            await signup(data.loginId, data.email, data.password);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: useAuthStore.getState().error || 'Signup failed'
            });
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
            >
                <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h3>
                <p className="text-gray-600">Redirecting to login page...</p>
            </motion.div>
        );
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* Login ID */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="loginId">
                    Login ID
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="loginId"
                        type="text"
                        placeholder="admin_john"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        {...register('loginId')}
                        disabled={isLoading}
                    />
                </div>
                {errors.loginId && (
                    <p className="text-sm text-red-500">{errors.loginId.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@company.com"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        {...register('email')}
                        disabled={isLoading}
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        {...register('password')}
                        disabled={isLoading}
                    />
                </div>
                {password && (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                            ? passwordStrength.color
                                            : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        {passwordStrength.label && (
                            <p className="text-xs text-gray-600">{passwordStrength.label}</p>
                        )}
                    </div>
                )}
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            {errors.root && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg bg-red-50 text-sm text-red-500 border border-red-100 flex items-center gap-2"
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {errors.root.message}
                </motion.div>
            )}

            <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.01]"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <>
                        Create Admin Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                </a>
            </div>
        </motion.form>
    );
}
