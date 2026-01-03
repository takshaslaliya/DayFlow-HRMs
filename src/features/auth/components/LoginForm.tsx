import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, type LoginInput } from '../schema';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (data.email === 'admin@company.com' && data.password === 'password') {
                login({ id: '1', name: 'Admin User', role: 'admin' });
                navigate('/dashboard');
            } else if (data.email === 'employee@company.com' && data.password === 'password') {
                login({ id: '2', name: 'John Doe', role: 'employee' });
                navigate('/dashboard');
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'Invalid credentials. Try admin@company.com or employee@company.com'
                });
            }
        } catch (error) {
            setError('root', { type: 'manual', message: 'Something went wrong' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    {...register('email')}
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    {...register('password')}
                    disabled={isLoading}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            {errors.root && (
                <div className="p-3 rounded-md bg-red-50 text-sm text-red-500">
                    {errors.root.message}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
            </Button>

            <div className="text-center text-xs text-gray-500 mt-4">
                <p>Demo Credentials:</p>
                <p>Emails: admin@company.com / employee@company.com</p>
                <p>Password: password</p>
            </div>
        </form>
    );
}
