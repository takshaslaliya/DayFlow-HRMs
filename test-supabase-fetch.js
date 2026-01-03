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
        console.log('Success! Response:', data);
    } catch (err) {
        console.error('Network error:', err.message);
    }
}

test();
