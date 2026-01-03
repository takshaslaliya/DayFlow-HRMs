import { useEffect, useState } from 'react';
import { Router } from './router';
import { Providers } from './providers';
import { AppErrorBoundary } from './error-boundary';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export default function App() {
    const checkSession = useAuthStore((state) => state.checkSession);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            await checkSession();
            setIsReady(true);
        };
        initAuth();
    }, [checkSession]);

    if (!isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <AppErrorBoundary>
            <Providers>
                <Router />
            </Providers>
        </AppErrorBoundary>
    );
}
