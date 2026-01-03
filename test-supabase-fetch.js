// Test Supabase connection using env variables
// Install dotenv if not present: npm install dotenv
import dotenv from 'dotenv';


dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase env variables');
    process.exit(1);
}

async function test() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=count`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                Prefer: 'count=exact',
            },
        });
        if (!res.ok) {
            console.error('HTTP error', res.status, await res.text());
            return;
        }
        const data = await res.json();
        console.log('Employees Check: Success! Count:', data[0].count);

        // Test Insert to Attendance (to check RLS)
        // We need a valid employee ID. We'll try to fetch one first.
        const empRes = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=id&limit=1`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });
        const empData = await empRes.json();
        if (empData.length > 0) {
            const empId = empData[0].id;
            console.log('Testing Attendance Insert for Employee:', empId);

            const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/attendance`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation'
                },
                body: JSON.stringify({
                    employee_id: empId,
                    attendance_date: new Date().toISOString().split('T')[0],
                    check_in: '12:00:00',
                    status: 'PRESENT'
                })
            });

            if (!insertRes.ok) {
                console.error('❌ Insert Failed:', insertRes.status, await insertRes.text());
            } else {
                console.log('✅ Insert Success!');
                // Cleanup
                const inserted = await insertRes.json();
                /* await fetch(`${SUPABASE_URL}/rest/v1/attendance?id=eq.${inserted[0].id}`, {
                    method: 'DELETE',
                    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
                }); */
            }
        }

    } catch (err) {
        console.error('Network error:', err.message);
    }
}

test();
