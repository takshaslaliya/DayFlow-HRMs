import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface User {
    id: string;
    email?: string;
    role?: string;
    metadata?: any;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        role: data.user.user_metadata?.role || 'employee', // Fallback role until DB trigger is set
                        metadata: data.user.user_metadata,
                    },
                });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await supabase.auth.signOut();
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
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                set({
                    user: {
                        id: session.user.id,
                        email: session.user.email,
                        role: session.user.user_metadata?.role || 'employee',
                        metadata: session.user.user_metadata,
                    },
                });
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
