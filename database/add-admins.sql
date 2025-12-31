-- SQL Script to add Admin Users
-- Run this in Supabase SQL Editor after creating the users in Auth

-- Replace the UUIDs with actual user IDs from Supabase Auth
-- You can find them in Supabase Auth dashboard

INSERT INTO users (id, email, role, created_at) VALUES
-- Walid Admin User - Replace UUID with actual Supabase Auth ID
('WALID_USER_ID_HERE', 'walid.genidy@gmail.com', 'admin', NOW()),
-- Sohila Admin User - Replace UUID with actual Supabase Auth ID  
('SOHILA_USER_ID_HERE', 'sohila.esmatt93@gmail.com', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET role='admin';
