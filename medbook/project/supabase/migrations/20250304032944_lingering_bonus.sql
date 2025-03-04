/*
  # Add payment fields to bookings table

  1. Changes
    - Add payment_status column to bookings table
    - Add payment_id column to bookings table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add payment fields to bookings table
ALTER TABLE IF EXISTS bookings 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_id TEXT;