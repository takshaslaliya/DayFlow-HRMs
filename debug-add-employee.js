
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdvbflqynoyxpdsklwvi.supabase.co';
const supabaseAnonKey = 'sb_publishable_SgvloXz6WAL6pZUXPVG_Fg_s7aBrbLl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Testing Add Employee...');

    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `test.employee.${randomSuffix}@example.com`;
    const firstName = 'Test';
    const lastName = `Employee${randomSuffix}`;
    const loginId = `testemp${randomSuffix}`;

    console.log(`Creating user with email: ${email}, loginId: ${loginId}`);

    // 1. Create User
    const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
            login_id: loginId,
            email: email,
            password_hash: 'defaultParams123!',
            role: 'EMPLOYEE',
            is_active: true
        })
        .select()
        .single();

    if (userError) {
        console.error('User creation failed:', userError);
        return;
    }
    console.log('User created:', userData.id);

    // 2. Create Employee
    const { data: employeeData, error: empError } = await supabase
        .from('employees')
        .insert({
            user_id: userData.id,
            first_name: firstName,
            last_name: lastName,
            designation: 'Tester',
            department: 'QA',
            phone: '1234567890',
            address: '123 Test Lane',
            date_of_joining: new Date().toISOString().split('T')[0],
            profile_image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
        })
        .select()
        .single();

    if (empError) {
        console.error('Employee creation failed:', empError);
    } else {
        console.log('Employee created successfully:', employeeData.id);
    }
}

run();
