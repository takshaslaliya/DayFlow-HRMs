-- EXPLICITLY DISABLE ROW LEVEL SECURITY ON ALL TABLES
-- Run this in Supabase SQL Editor to ensure no permission blocks.

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_off_balance DISABLE ROW LEVEL SECURITY;

-- Verify it worked by running:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
