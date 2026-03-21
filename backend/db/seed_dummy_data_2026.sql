BEGIN;

-- Reset existing data and restart identities.
TRUNCATE TABLE
  notifications,
  payments,
  monthly_records,
  subscription_plans,
  flats,
  users
RESTART IDENTITY CASCADE;

-- Test login password for all seeded users:
-- plain text: Password@123
-- bcrypt hash used here: $2b$10$OFeNPS.uX3KSwKPcgaQo2elJd4hL8gS4OiEOlWXVbBFciy0jNOyxi

INSERT INTO users (id, name, email, password, role, phone, created_at)
VALUES
  (1, 'Amit Sharma', 'admin@society.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'admin', '9000000001', '2025-12-20 09:00:00'),
  (2, 'Rohan Mehta', 'rohan@example.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'resident', '9000000002', '2025-12-24 10:15:00'),
  (3, 'Neha Verma', 'neha@example.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'resident', '9000000003', '2026-01-08 11:00:00'),
  (4, 'Arjun Nair', 'arjun@example.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'resident', '9000000004', '2026-02-03 12:30:00'),
  (5, 'Sneha Iyer', 'sneha@example.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'resident', '9000000005', '2026-01-02 14:45:00'),
  (6, 'Karan Patel', 'karan@example.com', '$2a$10$cZTywTFp1q5lY0sMx/G53eQ/qHDfWDG48xaXQn6pTux4cTWHDUP4.', 'resident', '9000000006', '2026-03-15 16:00:00');

INSERT INTO subscription_plans (id, flat_type, monthly_amount, updated_at)
VALUES
  (1, '1BHK', 2500, '2025-12-15 09:00:00'),
  (2, '2BHK', 4000, '2025-12-15 09:00:00'),
  (3, '3BHK', 5500, '2025-12-15 09:00:00');

-- Current flat states:
-- 101 occupied by Rohan since Dec 2025
-- 102 occupied by Neha since Jan 2026
-- 103 vacant from the start
-- 201 occupied by Arjun since Feb 2026
-- 202 vacated in Mar 2026, so current owner fields are null
-- 203 assigned to Karan on Mar 18, 2026, so Mar record should not exist
INSERT INTO flats (
  id,
  flat_number,
  owner_name,
  owner_email,
  phone,
  flat_type,
  status,
  user_id,
  assigned_at,
  is_deleted,
  created_at
)
VALUES
  (1, 'A-101', 'Rohan Mehta', 'rohan@example.com', '9000000002', '1BHK', 'occupied', 2, '2025-12-28 10:00:00', false, '2025-12-22 09:00:00'),
  (2, 'A-102', 'Neha Verma', 'neha@example.com', '9000000003', '2BHK', 'occupied', 3, '2026-01-10 09:30:00', false, '2025-12-22 09:05:00'),
  (3, 'A-103', NULL, NULL, NULL, '1BHK', 'vacant', NULL, NULL, false, '2025-12-22 09:10:00'),
  (4, 'B-201', 'Arjun Nair', 'arjun@example.com', '9000000004', '3BHK', 'occupied', 4, '2026-02-05 08:45:00', false, '2025-12-22 09:15:00'),
  (5, 'B-202', NULL, NULL, NULL, '2BHK', 'vacant', NULL, NULL, false, '2025-12-22 09:20:00'),
  (6, 'B-203', 'Karan Patel', 'karan@example.com', '9000000006', '1BHK', 'occupied', 6, '2026-03-18 17:30:00', false, '2026-01-25 10:00:00');

-- Historical monthly records with owner snapshots preserved.
-- B-202 intentionally keeps snapshot owner details even though the flat is currently vacant.
-- B-203 starts after Mar 1, so there is no Mar 2026 record for it.
INSERT INTO monthly_records (
  id,
  flat_id,
  month,
  year,
  amount,
  owner_name,
  owner_email,
  owner_phone,
  status,
  created_at
)
VALUES
  (1, 1, 1, 2026, 2500, 'Rohan Mehta', 'rohan@example.com', '9000000002', 'paid', '2026-01-01 08:00:00'),
  (2, 2, 1, 2026, 4000, 'Neha Verma', 'neha@example.com', '9000000003', 'pending', '2026-01-10 10:00:00'),
  (3, 5, 1, 2026, 4000, 'Sneha Iyer', 'sneha@example.com', '9000000005', 'paid', '2026-01-03 09:00:00'),
  (4, 1, 2, 2026, 2500, 'Rohan Mehta', 'rohan@example.com', '9000000002', 'paid', '2026-02-01 08:00:00'),
  (5, 2, 2, 2026, 4000, 'Neha Verma', 'neha@example.com', '9000000003', 'paid', '2026-02-01 08:05:00'),
  (6, 4, 2, 2026, 5500, 'Arjun Nair', 'arjun@example.com', '9000000004', 'pending', '2026-02-05 09:00:00'),
  (7, 5, 2, 2026, 4000, 'Sneha Iyer', 'sneha@example.com', '9000000005', 'paid', '2026-02-01 08:10:00'),
  (8, 1, 3, 2026, 2500, 'Rohan Mehta', 'rohan@example.com', '9000000002', 'paid', '2026-03-01 08:00:00'),
  (9, 2, 3, 2026, 4000, 'Neha Verma', 'neha@example.com', '9000000003', 'pending', '2026-03-01 08:05:00'),
  (10, 4, 3, 2026, 5500, 'Arjun Nair', 'arjun@example.com', '9000000004', 'pending', '2026-03-01 08:10:00');

INSERT INTO payments (
  id,
  flat_id,
  month,
  year,
  amount,
  payment_mode,
  transaction_id,
  status,
  created_at
)
VALUES
  (1, 1, 1, 2026, 2500, 'online', 'TXN-A101-2026-01', 'success', '2026-01-04 11:00:00'),
  (2, 5, 1, 2026, 4000, 'cash', 'TXN-B202-2026-01', 'success', '2026-01-06 12:15:00'),
  (3, 1, 2, 2026, 2500, 'upi', 'TXN-A101-2026-02', 'success', '2026-02-03 10:30:00'),
  (4, 2, 2, 2026, 4000, 'online', 'TXN-A102-2026-02', 'success', '2026-02-06 16:20:00'),
  (5, 5, 2, 2026, 4000, 'online', 'TXN-B202-2026-02', 'success', '2026-02-07 14:45:00'),
  (6, 1, 3, 2026, 2500, 'online', 'TXN-A101-2026-03', 'success', '2026-03-04 09:25:00');

INSERT INTO notifications (
  id,
  title,
  message,
  flat_id,
  user_id,
  target_type,
  created_at
)
VALUES
  (1, 'January Dues Generated', 'Monthly dues for January 2026 have been generated.', NULL, NULL, 'all', '2026-01-01 09:00:00'),
  (2, 'Payment Reminder', 'Please clear February maintenance dues for Flat A-102.', 2, 3, 'resident', '2026-02-20 18:00:00'),
  (3, 'Vacate Update', 'Flat B-202 was vacated and is now available.', 5, NULL, 'flat', '2026-03-12 13:00:00'),
  (4, 'New Resident Assigned', 'Flat B-203 has been assigned to a new resident.', 6, 6, 'resident', '2026-03-18 18:00:00');

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);
SELECT setval(pg_get_serial_sequence('subscription_plans', 'id'), COALESCE((SELECT MAX(id) FROM subscription_plans), 1), true);
SELECT setval(pg_get_serial_sequence('flats', 'id'), COALESCE((SELECT MAX(id) FROM flats), 1), true);
SELECT setval(pg_get_serial_sequence('monthly_records', 'id'), COALESCE((SELECT MAX(id) FROM monthly_records), 1), true);
SELECT setval(pg_get_serial_sequence('payments', 'id'), COALESCE((SELECT MAX(id) FROM payments), 1), true);
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE((SELECT MAX(id) FROM notifications), 1), true);

COMMIT;
