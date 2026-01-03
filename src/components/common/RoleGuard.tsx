import type { ReactNode } from 'react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles: _allowedRoles }: RoleGuardProps) {
    // Logic to check role
    const hasAccess = true; // Replace with actual check

    if (!hasAccess) {
        return null; // Or unauthorized component
    }

    return <>{children}</>;
}
