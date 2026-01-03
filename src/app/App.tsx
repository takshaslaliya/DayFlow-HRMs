import { Router } from './router';
import { Providers } from './providers';
import { AppErrorBoundary } from './error-boundary';

export default function App() {
    return (
        <AppErrorBoundary>
            <Providers>
                <Router />
            </Providers>
        </AppErrorBoundary>
    );
}
