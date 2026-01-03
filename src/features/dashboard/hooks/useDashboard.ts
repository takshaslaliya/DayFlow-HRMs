import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api';

export function useDashboard() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
    });

    return { stats, isLoading, error };
}
