import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, type LoginInput } from '../schema';

export function LoginForm() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data.loginId, data.password);
            navigate('/dashboard');
        } catch (error) {
            // Error handling is managed by the store, but we can also set form error here if needed
            setError('root', {
                type: 'manual',
                message: useAuthStore.getState().error || 'Login failed'
            });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="loginId">
                    Login ID / Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        id="loginId"
                        type="text"
                        placeholder="john_doe or john@company.com"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        {...register('loginId')}
                        disabled={isLoading}
                    />
                </div>
                {errors.loginId && (
                    <p className="text-sm text-red-500">{errors.loginId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                    </label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </a>
                </div>
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
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
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
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Create admin account
                </a>
            </div>
        </motion.form>
    );
}
