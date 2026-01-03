-- 1. USERS TABLE (Authentication + Login ID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    login_id VARCHAR(25) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL CHECK (
        role IN ('ADMIN', 'HR', 'EMPLOYEE')
    ),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EMPLOYEES TABLE
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(15) CHECK (phone ~ '^[0-9]{10,15}$'),

    date_of_birth DATE CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years'),

    address TEXT,

    designation VARCHAR(100),
    department VARCHAR(100),

    date_of_joining DATE NOT NULL,

    profile_image TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ATTENDANCE TABLE (Check-In / Check-Out)
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    attendance_date DATE NOT NULL,

    check_in TIME NOT NULL,
    check_out TIME,

    total_hours NUMERIC(4,2),

    status VARCHAR(20) NOT NULL CHECK (
        status IN ('PRESENT', 'ABSENT', 'HALF_DAY')
    ),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_attendance_per_day
        UNIQUE (employee_id, attendance_date),

    CONSTRAINT valid_check_times
        CHECK (check_out IS NULL OR check_out > check_in)
);

-- 4. SALARIES TABLE (ADMIN ONLY)
CREATE TABLE salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    wage_type VARCHAR(20) NOT NULL CHECK (
        wage_type IN ('FIXED', 'HOURLY')
    ),

    base_wage NUMERIC(10,2) NOT NULL CHECK (base_wage > 0),

    working_days INT DEFAULT 22 CHECK (working_days > 0),

    monthly_ctc NUMERIC(10,2),
    yearly_ctc NUMERIC(10,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SALARY COMPONENTS (Auto-Calculated)
CREATE TABLE salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    salary_id UUID NOT NULL REFERENCES salaries(id) ON DELETE CASCADE,

    component_name VARCHAR(50) NOT NULL CHECK (
        component_name IN (
            'BASIC',
            'HRA',
            'BONUS',
            'STANDARD_ALLOWANCE',
            'TRAVEL_ALLOWANCE',
            'PROVIDENT_FUND',
            'PROFESSIONAL_TAX'
        )
    ),

    calculation_type VARCHAR(20) NOT NULL CHECK (
        calculation_type IN ('PERCENTAGE', 'FIXED')
    ),

    value NUMERIC(6,2) NOT NULL CHECK (value >= 0),

    computed_amount NUMERIC(10,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. LEAVE REQUESTS (TIME-OFF)
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    leave_type VARCHAR(20) NOT NULL CHECK (
        leave_type IN ('PAID', 'SICK', 'UNPAID')
    ),

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    reason TEXT NOT NULL,

    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'APPROVED', 'REJECTED')
    ),

    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_leave_dates
        CHECK (end_date >= start_date)
);

-- 7. TIME-OFF BALANCE
CREATE TABLE time_off_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    leave_type VARCHAR(20) NOT NULL CHECK (
        leave_type IN ('PAID', 'SICK', 'UNPAID')
    ),

    total_allocated INT NOT NULL CHECK (total_allocated >= 0),
    used INT DEFAULT 0 CHECK (used >= 0),

    remaining INT GENERATED ALWAYS AS (total_allocated - used) STORED,

    UNIQUE (employee_id, leave_type)
);

-- 8. INDEXES (PERFORMANCE)
CREATE INDEX idx_users_login_id ON users(login_id);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, attendance_date);
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);

-- 9. ROW LEVEL SECURITY (Supabase-Ready)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
