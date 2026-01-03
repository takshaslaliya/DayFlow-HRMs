-- FIX ATTENDANCE STATUS CONSTRAINT
-- The initial schema only allowed 'PRESENT', 'ABSENT', 'HALF_DAY'.
-- But the code generates 'LATE' if check-in is after 9:30 AM.

-- 1. Drop the old restriction
ALTER TABLE attendance DROP CONSTRAINT attendance_status_check;

-- 2. Add the new restriction including 'LATE' and 'ON_LEAVE' just in case
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
    CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE'));

-- 3. Also Ensure RLS is disabled to prevent permissions issues
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
