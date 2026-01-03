// Seed a demo employee user
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase env variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
    console.log('🌱 Seeding demo employee...');

    // 1. Create User
    const loginId = 'DEMOEMP2026';
    const email = 'demo.employee@dayflow.com';
    const password = 'Password@123';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert User
    console.log('Creating user account...');
    const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
            login_id: loginId,
            email: email,
            password_hash: passwordHash,
            role: 'EMPLOYEE',
            is_active: true
        })
        .select()
        .single();

    if (userError) {
        if (userError.code === '23505') { // Unique violation
            console.log('⚠️ User already exists, fetching existing user...');
            const { data: existingUser } = await supabase
                .from('users')
                .select()
                .eq('login_id', loginId)
                .single();

            if (existingUser) return createEmployeeProfile(existingUser);
        }
        console.error('❌ Error creating user:', userError.message);
        return;
    }

    console.log('✅ User created:', user.id);
    await createEmployeeProfile(user);
}

async function createEmployeeProfile(user) {
    // 2. Create Employee Profile
    console.log('Creating employee profile...');

    // Check if profile exists
    const { data: existingProfile } = await supabase
        .from('employees')
        .select()
        .eq('user_id', user.id)
        .maybeSingle();

    if (existingProfile) {
        console.log('⚠️ Employee profile already exists.');
        return;
    }

    const { data: employee, error: empError } = await supabase
        .from('employees')
        .insert({
            user_id: user.id,
            first_name: 'Demo',
            last_name: 'Employee',
            phone: '9876543210',
            date_of_birth: '1995-05-15',
            address: '123 Tech Park, Innovation City',
            designation: 'Software Engineer',
            department: 'Engineering',
            date_of_joining: new Date().toISOString().split('T')[0], // Today
            profile_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
        })
        .select()
        .single();

    if (empError) {
        console.error('❌ Error creating employee profile:', empError.message);
        return;
    }

    console.log('✅ Employee profile created:', employee.id);
    console.log('\n🎉 Demo Employee Ready!');
    console.log('------------------------------------------------');
    console.log('Login ID:  ' + user.login_id);
    console.log('Email:     ' + user.email);
    console.log('Password:  Password@123');
    console.log('------------------------------------------------');
}

seed();
