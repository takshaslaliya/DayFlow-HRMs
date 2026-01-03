
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdvbflqynoyxpdsklwvi.supabase.co';
const supabaseAnonKey = 'sb_publishable_SgvloXz6WAL6pZUXPVG_Fg_s7aBrbLl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Testing connection...');

    // 1. Simple fetch
    console.log('\n--- 1. Fetching employees (no join) ---');
    const { data: d1, error: e1 } = await supabase.from('employees').select('*').limit(1);
    if (e1) console.error('Error 1:', e1);
    else console.log('Success 1:', d1);

    // 2. Fetch with join
    console.log('\n--- 2. Fetching employees with user join ---');
    const { data: d2, error: e2 } = await supabase
        .from('employees')
        .select(`
            *,
            user:users (
                email,
                is_active
            )
        `).limit(1);

    if (e2) console.error('Error 2:', JSON.stringify(e2, null, 2));
    else console.log('Success 2:', d2);

    // 3. Fetch users directly
    console.log('\n--- 3. Fetching users directly ---');
    const { data: d3, error: e3 } = await supabase.from('users').select('*').limit(1);
    if (e3) console.error('Error 3:', e3);
    else console.log('Success 3:', d3);
}

run();
