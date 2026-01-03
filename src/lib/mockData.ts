export const attendanceRecords = [
  { id: 1, employeeId: '2', employeeName: 'Krutarth Patel', date: '2026-01-01', status: 'present', checkIn: '09:00', checkOut: '17:00', workHours: 8 },
  { id: 2, employeeId: '2', employeeName: 'Krutarth Patel', date: '2026-01-02', status: 'present', checkIn: '09:05', checkOut: '17:15', workHours: 8.1 },
  { id: 3, employeeId: '2', employeeName: 'Krutarth Patel', date: '2026-01-03', status: 'present', checkIn: '09:00', checkOut: '17:00', workHours: 8 }, // Today
  { id: 4, employeeId: '2', employeeName: 'Krutarth Patel', date: '2025-12-31', status: 'present', checkIn: '08:55', checkOut: '17:00', workHours: 8.1 },
  { id: 5, employeeId: '2', employeeName: 'Krutarth Patel', date: '2025-12-30', status: 'late', checkIn: '10:00', checkOut: '17:00', workHours: 7 },
  { id: 6, employeeId: '2', employeeName: 'Krutarth Patel', date: '2025-12-29', status: 'absent', checkIn: null, checkOut: null, workHours: 0 },
  { id: 7, employeeId: '2', employeeName: 'Krutarth Patel', date: '2025-12-28', status: 'leave', checkIn: null, checkOut: null, workHours: 0 },
];

export const leaveRequests = [
  { id: 1, employeeId: '2', employeeName: 'Krutarth Patel', employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'approved', type: 'sick', startDate: '2025-12-15', endDate: '2025-12-16', reason: 'Flu', appliedOn: '2025-12-10' },
  { id: 2, employeeId: '2', employeeName: 'Krutarth Patel', employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'pending', type: 'casual', startDate: '2026-01-10', endDate: '2026-01-12', reason: 'Family function', appliedOn: '2026-01-02' },
];

export const recentActivities = [
  { id: 1, type: 'check-in', message: 'You checked in', timestamp: '2026-01-03T09:02:00' },
  { id: 2, type: 'leave-pending', message: 'Leave request pending approval', timestamp: '2026-01-02T14:30:00' },
  { id: 3, type: 'check-out', message: 'You checked out', timestamp: '2026-01-02T18:00:00' },
  { id: 4, type: 'check-in', message: 'You checked in', timestamp: '2026-01-02T09:00:00' },
  { id: 5, type: 'salary-processed', message: 'Salary slip generated', timestamp: '2026-01-01T10:00:00' },
];

export const employees = [
  {
    id: '2',
    name: 'Krutarth Patel',
    email: 'krutarth@example.com',
    position: 'Senior Developer',
    department: 'Engineering',
    phone: '+1 (555) 000-0000',
    address: '123 Tech Street, Silicon Valley, CA',
    joinDate: '2023-01-15',
    salary: 120000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    position: 'UI Designer',
    department: 'Design',
    phone: '+1 (555) 111-2222',
    address: '456 Design Ave, Creative City, NY',
    joinDate: '2023-03-20',
    salary: 95000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

export const monthlyPayrollData = [
  { month: 'Jan', total: 45000 },
  { month: 'Feb', total: 45000 },
  { month: 'Mar', total: 48000 },
  { month: 'Apr', total: 48000 },
  { month: 'May', total: 48000 },
  { month: 'Jun', total: 52000 },
];
