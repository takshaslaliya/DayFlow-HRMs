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

const weeklyData = [
    { name: 'Mon', present: 110, absent: 14 },
    { name: 'Tue', present: 115, absent: 9 },
    { name: 'Wed', present: 108, absent: 16 },
    { name: 'Thu', present: 112, absent: 12 },
    { name: 'Fri', present: 118, absent: 6 },
    { name: 'Sat', present: 45, absent: 8 }, // Half day / fewer staff
    { name: 'Sun', present: 10, absent: 5 },  // Overtime / shifts
];

const pieData = [
    { name: 'Present', value: 112, color: '#22c55e' },
    { name: 'Absent', value: 12, color: '#ef4444' },
    { name: 'On Leave', value: 5, color: '#eab308' },
];

export function AttendanceCharts() {
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
