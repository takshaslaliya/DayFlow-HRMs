import { useState } from 'react';
import type { SalaryComponent, ComponentName, CalculationType } from '../types';
import { getSalaryComponents, upsertSalaryComponent, deleteSalaryComponent } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface SalaryComponentsProps {
    salaryId: string;
}

export function SalaryComponents({ salaryId }: SalaryComponentsProps) {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { data: components, isLoading } = useQuery({
        queryKey: ['salary-components', salaryId],
        queryFn: () => getSalaryComponents(salaryId),
    });

    const upsertMutation = useMutation({
        mutationFn: (values: Omit<SalaryComponent, 'id' | 'created_at'> & { id?: string }) => upsertSalaryComponent(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salary-components', salaryId] });
            setIsAdding(false);
            setEditingId(null);
            toast.success('Component saved');
        },
        onError: (error: Error) => toast.error(error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSalaryComponent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salary-components', salaryId] });
            toast.success('Component deleted');
        },
        onError: (error: Error) => toast.error(error.message),
    });

    if (isLoading) return <div>Loading components...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Salary Components</CardTitle>
                    <CardDescription>Breakdown of basic, allowances, and deductions.</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <Plus className="h-4 w-4 mr-1" /> Add Component
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isAdding && (
                            <EditableRow
                                salaryId={salaryId}
                                onSave={(v) => upsertMutation.mutate(v)}
                                onCancel={() => setIsAdding(false)}
                            />
                        )}
                        {components?.map((comp) => (
                            editingId === comp.id ? (
                                <EditableRow
                                    key={comp.id}
                                    salaryId={salaryId}
                                    initialData={comp}
                                    onSave={(v) => upsertMutation.mutate({ ...v, id: comp.id })}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <TableRow key={comp.id}>
                                    <TableCell className="font-medium">{comp.component_name}</TableCell>
                                    <TableCell className="capitalize">{comp.calculation_type.toLowerCase()}</TableCell>
                                    <TableCell>{comp.value}{comp.calculation_type === 'PERCENTAGE' ? '%' : ''}</TableCell>
                                    <TableCell>₹{comp.computed_amount?.toLocaleString() || '-'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingId(comp.id)}>
                                            <Save className="h-4 w-4" /> {/* Should be edit icon but using Save to keep it simple */}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(comp.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function EditableRow({
    salaryId,
    initialData,
    onSave,
    onCancel
}: {
    salaryId: string;
    initialData?: SalaryComponent;
    onSave: (v: Omit<SalaryComponent, 'id' | 'created_at'>) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState<ComponentName>(initialData?.component_name || 'BASIC');
    const [type, setType] = useState<CalculationType>(initialData?.calculation_type || 'FIXED');
    const [value, setValue] = useState(initialData?.value || 0);

    return (
        <TableRow>
            <TableCell>
                <Select value={name} onValueChange={(v: string) => setName(v as ComponentName)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="HRA">HRA</SelectItem>
                        <SelectItem value="BONUS">Bonus</SelectItem>
                        <SelectItem value="STANDARD_ALLOWANCE">Std Allowance</SelectItem>
                        <SelectItem value="TRAVEL_ALLOWANCE">Travel</SelectItem>
                        <SelectItem value="PROVIDENT_FUND">PF</SelectItem>
                        <SelectItem value="PROFESSIONAL_TAX">Prof Tax</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Select value={type} onValueChange={(v: string) => setType(v as CalculationType)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    className="w-[100px]"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                />
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onSave({ salary_id: salaryId, component_name: name, calculation_type: type, value })}>
                    <Save className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="h-4 w-4 text-muted-foreground" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
