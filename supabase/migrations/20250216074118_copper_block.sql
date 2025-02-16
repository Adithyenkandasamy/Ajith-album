/*
  # Initial Schema Setup for Photo Album App

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text)
      - `name` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
      - `description` (text)
      - `is_approved` (boolean)

  2. Security
    - Enable RLS on `photos` table
    - Add policies for:
      - Anyone can view approved photos
      - Authenticated users can insert photos
      - Admin can manage all photos
*/

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  is_approved boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved photos"
  ON photos
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can upload photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all photos"
  ON photos
  TO authenticated
  USING (
    auth.email() = 'admin@photoalbum.com'
  )
  WITH CHECK (
    auth.email() = 'admin@photoalbum.com'
  );