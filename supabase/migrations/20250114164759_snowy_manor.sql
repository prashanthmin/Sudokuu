/*
  # Create movies table with search capabilities

  1. New Tables
    - `movies`
      - `id` (bigint, primary key)
      - `title` (text, not null)
      - `poster_url` (text, not null)
      - `rating` (numeric(3,1), not null)
      - `year` (integer, not null)
      - `duration` (text, not null)
      - `genre` (text, not null)
      - `description` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Extensions
    - Enable pg_trgm for text search capabilities

  3. Security
    - Enable RLS on `movies` table
    - Add policy for public read access
    - Add policy for admin management
*/

-- Enable the pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create the movies table
CREATE TABLE IF NOT EXISTS movies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  poster_url text NOT NULL,
  rating numeric(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  year integer NOT NULL,
  duration text NOT NULL,
  genre text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better search performance
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_movies_title') THEN
    CREATE INDEX idx_movies_title ON movies USING gin(title gin_trgm_ops);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_movies_genre') THEN
    CREATE INDEX idx_movies_genre ON movies USING gin(genre gin_trgm_ops);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_movies_description') THEN
    CREATE INDEX idx_movies_description ON movies USING gin(description gin_trgm_ops);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'movies' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON movies
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'movies' AND policyname = 'Allow admin full access'
  ) THEN
    CREATE POLICY "Allow admin full access"
      ON movies
      TO authenticated
      USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
      ))
      WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
      ));
  END IF;
END $$;