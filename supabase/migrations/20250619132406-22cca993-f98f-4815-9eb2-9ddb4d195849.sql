
-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('headquarters', 'police_station');

-- Create enum for police station codes
CREATE TYPE public.station_code AS ENUM ('wnptps', 'nrptps', 'mbnrps');

-- Create credentials table
CREATE TABLE public.credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type public.user_type NOT NULL,
  station_code public.station_code NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert headquarters credentials
INSERT INTO public.credentials (username, password, user_type, full_name) 
VALUES ('TGANBOFF', 'tganb', 'headquarters', 'Headquarters Officer');

-- Insert police station credentials
INSERT INTO public.credentials (username, password, user_type, station_code, full_name) 
VALUES 
  ('wnptps', 'policewnp', 'police_station', 'wnptps', 'Warangal North Police Station'),
  ('nrptps', 'policenrpt', 'police_station', 'nrptps', 'Nalgonda Rural Police Station'),
  ('mbnrps', 'policembnr', 'police_station', 'mbnrps', 'Mahbubnagar Police Station');

-- Enable Row Level Security
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for reading credentials (needed for login)
CREATE POLICY "Allow reading credentials for authentication" 
  ON public.credentials 
  FOR SELECT 
  USING (true);

-- Create sessions table to track user sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.credentials(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for sessions
CREATE POLICY "Users can manage their own sessions" 
  ON public.user_sessions 
  FOR ALL 
  USING (true);
