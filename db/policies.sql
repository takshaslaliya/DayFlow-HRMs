-- CLEANUP: Drop all existing policies to remove recursive definitions
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename IN ('users', 'employees', 'attendance', 'salaries', 'leave_requests')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Enable RLS (Ensure it's enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- 1. USERS
-- Allow validated users to read everything.
CREATE POLICY "Allow authenticated read access" ON users
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (e.g. Admins) to create NEW users
CREATE POLICY "Allow authenticated insert access" ON users
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own profile?
CREATE POLICY "Allow individual update" ON users
    FOR UPDATE TO authenticated USING (id = auth.uid());


-- 2. EMPLOYEES
-- Allow authenticated users to read all employee records
CREATE POLICY "Allow authenticated read access" ON employees
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users (e.g. Admins) to create NEW employees
CREATE POLICY "Allow authenticated insert access" ON employees
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update/delete (e.g. Admins)
CREATE POLICY "Allow authenticated update access" ON employees
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete access" ON employees
    FOR DELETE TO authenticated USING (true);


-- 3. ATTENDANCE
CREATE POLICY "Allow authenticated read access" ON attendance
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON attendance
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 4. SALARIES
CREATE POLICY "Allow authenticated read access" ON salaries
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON salaries
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 5. LEAVE REQUESTS
CREATE POLICY "Allow authenticated read access" ON leave_requests
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write access" ON leave_requests
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
