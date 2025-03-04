/*
  # Create doctors and bookings tables

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `specialization` (text, not null)
      - `experience` (integer)
      - `followers` (integer)
      - `ratings` (numeric)
      - `languages` (text array)
      - `about` (text)
      - `specializations` (text array)
      - `concerns_treated` (text array)
      - `image` (text)
      - `location` (text)
      - `gender` (text)
      - `created_at` (timestamptz)
    - `work_experience`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `position` (text)
      - `hospital` (text)
      - `duration` (text)
      - `created_at` (timestamptz)
    - `doctor_fees`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `in_clinic` (integer)
      - `video` (integer)
      - `chat` (integer)
      - `created_at` (timestamptz)
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `doctor_id` (uuid, foreign key to doctors)
      - `booking_date` (date)
      - `booking_time` (time)
      - `consultation_type` (text)
      - `status` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and create bookings
    - Add policies for public access to doctors data
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  experience integer,
  followers integer DEFAULT 0,
  ratings numeric DEFAULT 0,
  languages text[] DEFAULT '{}',
  about text,
  specializations text[] DEFAULT '{}',
  concerns_treated text[] DEFAULT '{}',
  image text,
  location text,
  gender text,
  created_at timestamptz DEFAULT now()
);

-- Create work_experience table
CREATE TABLE IF NOT EXISTS work_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  position text NOT NULL,
  hospital text NOT NULL,
  duration text,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_fees table
CREATE TABLE IF NOT EXISTS doctor_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  in_clinic integer,
  video integer,
  chat integer,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  consultation_type text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for doctors table (public read access)
CREATE POLICY "Anyone can view doctors"
  ON doctors
  FOR SELECT
  USING (true);

-- Policies for work_experience table (public read access)
CREATE POLICY "Anyone can view work experience"
  ON work_experience
  FOR SELECT
  USING (true);

-- Policies for doctor_fees table (public read access)
CREATE POLICY "Anyone can view doctor fees"
  ON doctor_fees
  FOR SELECT
  USING (true);

-- Policies for bookings table
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample doctors data
INSERT INTO doctors (name, specialization, experience, followers, ratings, languages, about, specializations, concerns_treated, image, location, gender)
VALUES
  ('Sarah Johnson', 'Cardiologist', 15, 10000, 4.9, ARRAY['English', 'Spanish'], 'Experienced cardiologist specializing in preventive care.', ARRAY['Preventive Cardiology', 'Heart Disease', 'Hypertension'], ARRAY['Heart Disease', 'High Blood Pressure', 'Chest Pain'], 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800', 'New York, NY', 'female'),
  ('Michael Chen', 'Dermatologist', 10, 8000, 4.8, ARRAY['English', 'Mandarin'], 'Board-certified dermatologist with expertise in skin conditions.', ARRAY['Medical Dermatology', 'Cosmetic Dermatology'], ARRAY['Acne', 'Skin Cancer', 'Eczema'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800', 'San Francisco, CA', 'male');

-- Insert sample work experience
INSERT INTO work_experience (doctor_id, position, hospital, duration)
VALUES
  ((SELECT id FROM doctors WHERE name = 'Sarah Johnson'), 'Senior Cardiologist', 'City Heart Hospital', '2015 - Present'),
  ((SELECT id FROM doctors WHERE name = 'Sarah Johnson'), 'Consultant Cardiologist', 'Medical Center', '2010 - 2015'),
  ((SELECT id FROM doctors WHERE name = 'Michael Chen'), 'Lead Dermatologist', 'Skin Care Clinic', '2018 - Present');

-- Insert sample doctor fees
INSERT INTO doctor_fees (doctor_id, in_clinic, video, chat)
VALUES
  ((SELECT id FROM doctors WHERE name = 'Sarah Johnson'), 1000, 800, 500),
  ((SELECT id FROM doctors WHERE name = 'Michael Chen'), 900, 700, 400);