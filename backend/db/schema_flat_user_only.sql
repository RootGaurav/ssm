-- =====================================================
-- USERS (NO flat_id COLUMN)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','resident')),
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- FLATS (SOURCE OF ASSIGNMENT: flats.user_id -> users.id)
-- =====================================================
CREATE TABLE IF NOT EXISTS flats (
  id SERIAL PRIMARY KEY,
  flat_number VARCHAR(10) UNIQUE,
  owner_name TEXT,
  owner_email TEXT,
  phone TEXT,
  flat_type VARCHAR(20),
  status VARCHAR(20) DEFAULT 'vacant',
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_flats_user_id ON flats(user_id);


-- =====================================================
-- SUBSCRIPTION PLANS
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  flat_type VARCHAR(20) UNIQUE,
  monthly_amount INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- MONTHLY RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS monthly_records (
  id SERIAL PRIMARY KEY,
  flat_id INTEGER REFERENCES flats(id) ON DELETE CASCADE,
  month INTEGER CHECK (month BETWEEN 1 AND 12),
  year INTEGER,
  amount INTEGER,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_flat_month_year UNIQUE(flat_id, month, year),
  CONSTRAINT status_check CHECK (status IN ('pending', 'paid'))
);


-- =====================================================
-- PAYMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  flat_id INTEGER REFERENCES flats(id) ON DELETE CASCADE,
  month INTEGER CHECK (month BETWEEN 1 AND 12),
  year INTEGER,
  amount INTEGER,
  payment_mode VARCHAR(20),
  transaction_id TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_payment UNIQUE(flat_id, month, year),
  CONSTRAINT payment_mode_check CHECK (payment_mode IN ('online','cash','upi')),
  CONSTRAINT payment_status_check CHECK (status IN ('success','failed','pending'))
);


-- =====================================================
-- NOTIFICATIONS (FIXED DDL)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title TEXT,
  message TEXT,
  flat_id INTEGER REFERENCES flats(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) DEFAULT 'all' CHECK (target_type IN ('all','flat','resident')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
