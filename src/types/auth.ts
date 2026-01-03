export type Role = 'admin' | 'hr' | 'employee';

export interface User {
    id: string;
    email: string;
    role: Role;
}
