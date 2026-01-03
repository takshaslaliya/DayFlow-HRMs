import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salarySchema } from '../schema';
import type { Salary } from '../types';
import { createSalary, updateSalary } from '../api';
import { Button } from '../../../components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

type SalaryFormValues = z.infer<typeof salarySchema>;

interface SalaryFormProps {
    employeeId: string;
    initialData?: Salary | null;
    onSuccess?: () => void;
}

export function SalaryForm({ employeeId, initialData, onSuccess }: SalaryFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<SalaryFormValues>({
        resolver: zodResolver(salarySchema),
        defaultValues: {
            employee_id: employeeId,
            wage_type: initialData?.wage_type || 'FIXED',
            base_wage: initialData?.base_wage || 0,
            working_days: initialData?.working_days || 22,
            monthly_ctc: initialData?.monthly_ctc || 0,
            yearly_ctc: initialData?.yearly_ctc || 0,
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: SalaryFormValues) => {
            if (initialData?.id) {
                return updateSalary(initialData.id, values);
            }
            return createSalary(values);
        },
        onSuccess: () => {
            toast.success(initialData ? 'Salary updated successfully' : 'Salary created successfully');
            queryClient.invalidateQueries({ queryKey: ['salary', employeeId] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to save salary');
        },
    });

    function onSubmit(values: SalaryFormValues) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control as any}
                    name="wage_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Wage Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select wage type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="FIXED">Fixed</SelectItem>
                                    <SelectItem value="HOURLY">Hourly</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="base_wage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Base Wage</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="working_days"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Days</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="22"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control as any}
                        name="monthly_ctc"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Monthly CTC</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control as any}
                        name="yearly_ctc"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Yearly CTC</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : initialData ? 'Update Salary' : 'Create Salary'}
                </Button>
            </form>
        </Form>
    );
}
