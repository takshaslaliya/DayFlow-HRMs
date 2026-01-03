import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

export function AttendanceCharts() {
    const { stats } = useDashboard();

    // Use real stats if available, otherwise use empty or loading state
    const weeklyData = stats?.weeklyStats || [
        { name: 'Mon', present: 0, absent: 0 },
        { name: 'Tue', present: 0, absent: 0 },
        { name: 'Wed', present: 0, absent: 0 },
        { name: 'Thu', present: 0, absent: 0 },
        { name: 'Fri', present: 0, absent: 0 },
        { name: 'Sat', present: 0, absent: 0 },
        { name: 'Sun', present: 0, absent: 0 },
    ];

    const pieData = [
        { name: 'Present', value: stats?.presentToday || 0, color: '#22c55e' },
        { name: 'Absent', value: stats?.absentToday || 0, color: '#ef4444' },
        { name: 'On Leave', value: stats?.leavesPending || 0, color: '#eab308' }, // Note: Using pending as proxy for now or add 'Approved Leave Today' to API
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trend Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend (Last 7 Days)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
                            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
