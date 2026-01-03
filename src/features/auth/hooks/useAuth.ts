import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
    const store = useAuthStore();
    return {
        user: store.user,
        login: store.login,
        logout: store.logout,
        isAuthenticated: !!store.user,
        isLoading: store.isLoading
    };
}
