import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
    // Reusing AppLayout structure for now, but could be distinct
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Admin Area
                                </p>
                            </div>
                        </div>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
