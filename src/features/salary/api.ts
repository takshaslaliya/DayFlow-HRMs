import { supabase } from '../../lib/supabase';
import type { Salary, SalaryComponent } from './types';

export const getSalaryByEmployeeId = async (employeeId: string) => {
    const { data, error } = await supabase
        .from('salaries')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is for "no rows found"
    return data as Salary | null;
};

export const createSalary = async (salary: Omit<Salary, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
        .from('salaries')
        .insert(salary)
        .select()
        .single();

    if (error) throw error;
    return data as Salary;
};

export const updateSalary = async (id: string, salary: Partial<Omit<Salary, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
        .from('salaries')
        .update(salary)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Salary;
};

export const getSalaryComponents = async (salaryId: string) => {
    const { data, error } = await supabase
        .from('salary_components')
        .select('*')
        .eq('salary_id', salaryId);

    if (error) throw error;
    return data as SalaryComponent[];
};

export const upsertSalaryComponent = async (component: Omit<SalaryComponent, 'id' | 'created_at'> & { id?: string }) => {
    const { data, error } = await supabase
        .from('salary_components')
        .upsert(component)
        .select()
        .single();

    if (error) throw error;
    return data as SalaryComponent;
};

export const deleteSalaryComponent = async (id: string) => {
    const { error } = await supabase
        .from('salary_components')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const getPayrollData = async () => {
    const { data, error } = await supabase
        .from('employees')
        .select(`
            id,
            first_name,
            last_name,
            designation,
            department,
            salaries (
                id,
                base_wage,
                monthly_ctc,
                yearly_ctc,
                wage_type,
                working_days
            )
        `);

    if (error) throw error;
    return data;
};
