export const Roles = {
    ADMIN: 'admin',
    HR: 'hr',
    EMPLOYEE: 'employee',
} as const;

export type Roles = typeof Roles[keyof typeof Roles];
