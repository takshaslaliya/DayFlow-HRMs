import type { Salary } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { IndianRupee } from 'lucide-react';

interface SalaryCardProps {
    salary: Salary;
}

export function SalaryCard({ salary }: SalaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payroll Overview</CardTitle>
                <Badge variant={salary.wage_type === 'FIXED' ? 'default' : 'secondary'}>
                    {salary.wage_type}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">
                            {salary.monthly_ctc?.toLocaleString() || '0'}
                        </span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Yearly CTC</p>
                            <p className="font-medium">₹{salary.yearly_ctc?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Base Wage</p>
                            <p className="font-medium">₹{salary.base_wage.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Working Days</p>
                            <p className="font-medium">{salary.working_days} days</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
