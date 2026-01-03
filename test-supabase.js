// Quick test to verify Supabase connection
import { supabase } from './src/lib/supabase';

async function testConnection() {
    console.log('Testing Supabase connection...');

    // Test 1: Check if we can connect
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Error:', error.message);
            console.log('\nPossible issues:');
            console.log('1. Tables not created - Run db/schema.sql in Supabase SQL Editor');
            console.log('2. Project paused - Check Supabase dashboard');
            console.log('3. Wrong API key - Verify in Supabase Settings > API');
        } else {
            console.log('✅ Connection successful!');
            console.log('Tables exist and are accessible');
        }
    } catch (err) {
        console.error('❌ Network error:', err.message);
        console.log('\nThis is likely a CORS/network issue:');
        console.log('1. Check if Supabase project is active (not paused)');
        console.log('2. Verify internet connection');
        console.log('3. Check Supabase status: https://status.supabase.com/');
    }
}

testConnection();
