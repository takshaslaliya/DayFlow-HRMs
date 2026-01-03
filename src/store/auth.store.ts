import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface User {
    id: string;
    email?: string;
    loginId?: string;
    role?: string;
    metadata?: any;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (emailOrId: string, password: string) => Promise<void>;
    signup: (loginId: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (emailOrId, password) => {
        set({ isLoading: true, error: null });
        try {
            const searchTerm = emailOrId.trim();
            console.log('Attempting login for:', searchTerm);

            // 1. Check against public.users table
            // Try by Login ID first
            let { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('login_id', searchTerm)
                .maybeSingle(); // maybeSingle returns null if not found, instead of error

            // If not found by Login ID, try by Email
            if (!user && !error) {
                const { data: userByEmail, error: emailError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', searchTerm)
                    .maybeSingle();

                if (userByEmail) {
                    user = userByEmail;
                } else if (emailError) {
                    error = emailError;
                }
            }

            if (error) {
                console.error('Database error during login:', error);
                throw new Error(error.message);
            }

            if (!user) {
                console.error('User not found for:', searchTerm);
                throw new Error('Invalid login credentials');
            }

            // 2. Validate Password using bcrypt
            const { comparePassword } = await import('@/lib/password.utils');
            const isPasswordValid = await comparePassword(password, user.password_hash);

            if (!isPasswordValid) {
                throw new Error('Invalid login credentials');
            }

            if (!user.is_active) {
                throw new Error('Account is disabled');
            }

            // 3. Set User State
            const userObj = {
                id: user.id,
                email: user.email,
                role: user.role.toLowerCase(),
                metadata: { ...user }
            };

            set({ user: userObj });

            // Persist valid session roughly
            localStorage.setItem('dayflow_user', JSON.stringify(userObj));

        } catch (error: any) {
            console.error('Login process failed:', error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    signup: async (loginId, email, password) => {
        set({ isLoading: true, error: null });
        try {
            // Import password hashing utility
            const { hashPassword } = await import('@/lib/password.utils');

            // Check if login_id already exists
            const { data: existingLoginId } = await supabase
                .from('users')
                .select('id')
                .eq('login_id', loginId)
                .maybeSingle();

            if (existingLoginId) {
                throw new Error('Login ID already exists');
            }

            // Check if email already exists
            const { data: existingEmail } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (existingEmail) {
                throw new Error('Email already exists');
            }

            // Hash the password
            const passwordHash = await hashPassword(password);

            // Create the admin user
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    login_id: loginId,
                    email: email,
                    password_hash: passwordHash,
                    role: 'ADMIN',
                    is_active: true,
                })
                .select()
                .single();

            if (error) {
                console.error('Signup error:', error);
                throw new Error(error.message);
            }

            console.log('Admin user created successfully:', newUser);
        } catch (error: any) {
            console.error('Signup process failed:', error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            // Clear local state
            localStorage.removeItem('dayflow_user');
            set({ user: null });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    checkSession: async () => {
        set({ isLoading: true });
        try {
            const storedUser = localStorage.getItem('dayflow_user');
            if (storedUser) {
                set({ user: JSON.parse(storedUser) });
            } else {
                set({ user: null });
            }
        } catch (error) {
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    }
}));
